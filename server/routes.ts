import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";

// Interface for API message handling
interface ChatMessage {
  message: string;
  context_id?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    provider?: string;
    npc?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Add API routes
  app.get('/api/status', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'NPCSH API is running' });
  });
  
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'NPCSH API is healthy' });
  });

  // Chat API Routes
  app.post('/api/chat/message', async (req: Request, res: Response) => {
    try {
      console.log('Received chat message request:', {
        body: req.body,
        headers: req.headers,
        ip: req.ip
      });
      
      const { message, options, context_id } = req.body as ChatMessage;
      
      if (!message || typeof message !== 'string') {
        console.log('Invalid message format received:', req.body);
        return res.status(400).json({ message: 'Invalid message format' });
      }
      
      console.log('Processing chat message:', message);
      console.log('With options:', options);
      
      // Call NPCSH CLI command with options
      sendToNPCSH(message, options, (response) => {
        console.log('NPCSH response received, sending to client');
        
        const responseData = {
          id: Date.now().toString(),
          response: response,
          created_at: new Date().toISOString(),
          tokens: {
            prompt: message.length,
            completion: response.length,
            total: message.length + response.length
          }
        };
        
        res.json(responseData);
      });
    } catch (error) {
      console.error('Error in chat message endpoint:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/chat/history', (req: Request, res: Response) => {
    // For now, return empty history as NPCSH CLI doesn't support history retrieval yet
    res.json({
      messages: []
    });
  });
  
  app.delete('/api/chat/history', (req: Request, res: Response) => {
    // This is a mock since NPCSH CLI doesn't support history clearing yet
    res.json({
      success: true,
      message: "Conversation history cleared successfully."
    });
  });
  
  // System API Routes
  app.get('/api/system/status', (req: Request, res: Response) => {
    res.json({
      status: 'operational',
      version: '1.0.0',
      uptime: 'Unknown',
      api_rate_limit: {
        total: 1000,
        remaining: 1000,
        reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    });
  });

  return httpServer;
}

// Helper function to send messages to NPCSH command-line tool
function sendToNPCSH(
  message: string, 
  options?: ChatMessage['options'], 
  callback: (response: string) => void = () => {}
) {
  try {
    console.log('Executing NPCSH command with message:', message);
    console.log('Options:', options);
    
    // Build command with options
    let command = `source ~/.venvs/npcsh-venv/bin/activate && npc`;
    
    // Add optional parameters
    if (options?.model) {
      command += ` --model "${options.model.replace(/"/g, '\\"')}"`;
    }
    
    if (options?.provider) {
      command += ` --provider "${options.provider.replace(/"/g, '\\"')}"`;
    }
    
    if (options?.npc) {
      command += ` --npc "${options.npc.replace(/"/g, '\\"')}"`;
    }
    
    // Add the message at the end
    command += ` "${message.replace(/"/g, '\\"')}"`;
    
    console.log('Executing command:', command);
    
    // Execute the npc command with the message in the correct environment
    const npc = spawn('bash', ['-c', command]);
    
    let output = '';
    
    npc.stdout.on('data', (data: Buffer) => {
      const chunk = data.toString();
      console.log('NPCSH stdout chunk:', chunk);
      output += chunk;
    });
    
    npc.stderr.on('data', (data: Buffer) => {
      console.error(`NPCSH stderr: ${data}`);
    });
    
    npc.on('close', (code: number | null) => {
      console.log(`NPCSH process exited with code ${code}`);
      
      if (code !== 0) {
        console.warn(`NPCSH process exited with non-zero code ${code}`);
        callback('Sorry, I encountered an error processing your request.');
      } else {
        // Process the output to extract only the actual response
        // Split into lines and filter out warning/system messages
        const lines = output.split('\n');
        
        // Find the index after which the actual response starts
        // (After "explanation given:" line)
        let responseStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('explanation given:')) {
            responseStartIndex = i + 1;
            break;
          }
        }
        
        // If we found the marker, extract only the response part
        let processedOutput = '';
        if (responseStartIndex !== -1 && responseStartIndex < lines.length) {
          processedOutput = lines.slice(responseStartIndex).join('\n').trim();
        } else {
          // Fallback to original filtering if pattern not found
          processedOutput = lines.filter(line => 
            !line.startsWith('Warning:') && 
            !line.includes('TRANSFORMERS_CACHE') &&
            !line.includes('warnings.warn') &&
            !line.includes('action chosen:') &&
            !line.includes('explanation given:')
          ).join('\n').trim();
        }
        
        console.log('NPCSH processed response:', processedOutput);
        callback(processedOutput || 'No response from NPCSH.');
      }
    });
  } catch (error) {
    console.error('Error executing NPCSH command:', error);
    callback('Sorry, I encountered an error connecting to NPCSH.');
  }
}
