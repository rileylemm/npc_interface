# NPCSH Frontend Interface

A modern web interface for the [Non-Player Character Shell (NPCSH)](https://github.com/cagostino/npcsh), allowing for interactive chat conversations with AI-powered NPCs.

## Features

- Modern React-based web interface
- Real-time chat with NPCSH
- Configurable AI model parameters (provider, model, NPC name)
- Support for different NPC personas
- Clean, responsive UI

## Screenshots

*Screenshots to be added*

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Integration with [NPCSH command-line tool](https://github.com/cagostino/npcsh)

## Getting Started

### Prerequisites

- Node.js (v16+)
- [NPCSH](https://github.com/cagostino/npcsh) installed in a virtual environment at `~/.venvs/npcsh-venv/`
- npm or yarn

### Installation

#### 1. Install NPCSH First
Follow the [NPCSH installation instructions](https://github.com/cagostino/npcsh#installation):

```bash
# Create a virtual environment
python -m venv ~/.venvs/npcsh-venv

# Activate the environment
source ~/.venvs/npcsh-venv/bin/activate

# Install NPCSH
pip install npcsh

# For additional features, you can install extras
# pip install npcsh[lite]  # API libraries
# pip install npcsh[local]  # Full local package
# pip install npcsh[whisper]  # TTS/STT support
# pip install npcsh[all]  # Everything
```

#### 2. Clone and Setup the Frontend

```bash
git clone https://github.com/rileylemm/npc_interface.git
cd npc_interface
npm install
```

#### 3. Start the Development Server

```bash
npm run dev
```

#### 4. Open your browser to `http://localhost:3000`

## Usage

1. Type your message in the chat input
2. Configure NPC options by clicking the settings gear icon:
   - **Model**: Choose AI model (llama3.2, etc.)
   - **Provider**: Select AI provider (ollama, openai, anthropic, etc.)
   - **NPC Name**: Specify the name of the NPC character
3. Send messages and see NPC responses in real-time

## Configuration

You can configure various aspects of the AI using the settings panel:

- **Model**: Choose from various AI models supported by NPCSH
- **Provider**: Select from supported providers (ollama, openai, anthropic, gemini, deepseek, etc.)
- **NPC Name**: Specify the name of the NPC character to use

## Development

### Project Structure

```
npc_interface/
├── client/               # Frontend React app
│   ├── public/           # Static assets
│   └── src/              # React source code
│       ├── components/   # UI components
│       ├── lib/          # Utilities and state management
│       └── types/        # TypeScript type definitions
└── server/               # Backend Express server
    ├── routes.ts         # API routes
    └── index.ts          # Server entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server

## Roadmap

- Voice input/output capabilities
- Context-aware conversations with history
- File upload for additional context
- Enhanced markdown and code rendering
- Support for NPCSH tools and advanced features

## License

This project is licensed under the MIT License, following the same license as the [NPCSH project](https://github.com/cagostino/npcsh).

## Acknowledgements

- [NPCSH project](https://github.com/cagostino/npcsh) by [Christopher Agostino](https://github.com/cagostino) for the underlying AI capabilities
- Tailwind CSS for styling
- React community for inspiration and components

## Related Links

- [NPCSH GitHub Repository](https://github.com/cagostino/npcsh)
- [NPC Worldwide](https://npcworldwi.de/) - The organization behind NPCSH 