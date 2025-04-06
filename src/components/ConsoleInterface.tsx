
import React, { useState, useRef, useEffect } from 'react';
import ConsoleHeader from './ConsoleHeader';
import ConsoleInput from './ConsoleInput';
import MessageBlock, { MessageType, CodeBlockData } from './MessageBlock';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  codeBlocks?: Array<CodeBlockData | {
    code: string;
    language?: string;
    highlight?: number[];
    isRemoved?: boolean;
    isAdded?: boolean;
  }>;
}

const pythonCodeData: CodeBlockData[] = [
  {
    "file": "train.py",
    "startLine": 1,
    "endLine": 50,
    "newCode": "import torch\nimport torch.nn as nn\nimport torch.optim as optim\nfrom torch.utils.data import DataLoader\nfrom torch.utils.tensorboard import SummaryWriter\nimport argparse\nimport logging\nfrom datetime import datetime\n\n# Set up logging\nlogging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')\n\ndef parse_arguments():\n    parser = argparse.ArgumentParser(description='Training script with best practices')\n    parser.add_argument('--epochs', type=int, default=100, help='Number of training epochs')\n    parser.add_argument('--learning_rate', type=float, default=0.001, help='Learning rate')\n    parser.add_argument('--batch_size', type=int, default=64, help='Batch size for training')\n    parser.add_argument('--model_save_path', type=str, default='./checkpoints', help='Path to save model checkpoints')\n    return parser.parse_args()",
    "description": "Add argument parsing for better configurability and logging setup"
  },
  {
    "file": "train.py",
    "startLine": 51,
    "endLine": 100,
    "newCode": "def train(model, train_loader, val_loader, criterion, optimizer, epochs, device, writer):\n    best_val_loss = float('inf')\n    \n    for epoch in range(epochs):\n        model.train()\n        total_train_loss = 0.0\n        \n        for batch_idx, (data, targets) in enumerate(train_loader):\n            data, targets = data.to(device), targets.to(device)\n            \n            optimizer.zero_grad()\n            outputs = model(data)\n            loss = criterion(outputs, targets)\n            loss.backward()\n            optimizer.step()\n            \n            total_train_loss += loss.item()\n        \n        # Validation phase\n        model.eval()\n        total_val_loss = 0.0\n        with torch.no_grad():\n            for data, targets in val_loader:\n                data, targets = data.to(device), targets.to(device)\n                outputs = model(data)\n                val_loss = criterion(outputs, targets)\n                total_val_loss += val_loss.item()\n        \n        # Logging\n        avg_train_loss = total_train_loss / len(train_loader)\n        avg_val_loss = total_val_loss / len(val_loader)\n        \n        writer.add_scalar('Loss/train', avg_train_loss, epoch)\n        writer.add_scalar('Loss/validation', avg_val_loss, epoch)\n        \n        logging.info(f'Epoch {epoch+1}/{epochs}: Train Loss = {avg_train_loss:.4f}, Val Loss = {avg_val_loss:.4f}')\n        \n        # Model checkpointing\n        if avg_val_loss < best_val_loss:\n            best_val_loss = avg_val_loss\n            torch.save(model.state_dict(), f'{args.model_save_path}/best_model.pth')\n            logging.info(f'Saved best model at epoch {epoch+1}')",
    "description": "Implement comprehensive training loop with validation, logging, and checkpointing"
  },
  {
    "file": "train.py",
    "startLine": 101,
    "endLine": 150,
    "newCode": "def main():\n    args = parse_arguments()\n    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n    logging.info(f'Using device: {device}')\n    \n    # Dataset and model setup (replace with your specific implementations)\n    train_dataset = YourDataset(train=True)\n    val_dataset = YourDataset(train=False)\n    \n    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)\n    val_loader = DataLoader(val_dataset, batch_size=args.batch_size)\n    \n    model = YourModel().to(device)\n    criterion = nn.CrossEntropyLoss()\n    optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)\n    \n    # TensorBoard for visualization\n    current_time = datetime.now().strftime('%Y%m%d_%H%M%S')\n    writer = SummaryWriter(f'runs/{current_time}')\n    \n    # Train the model\n    train(\n        model=model, \n        train_loader=train_loader, \n        val_loader=val_loader,\n        criterion=criterion,\n        optimizer=optimizer, \n        epochs=args.epochs, \n        device=device,\n        writer=writer\n    )\n    \n    writer.close()\n    logging.info('Training complete!')\n\nif __name__ == '__main__':\n    main()",
    "description": "Add main function with comprehensive setup and execution"
  }
];

// Mock code suggestions format example
const codeSuggestionsExample = `I'll help you improve the \`template/train.py\` file by providing suggestions to enhance its structure, readability, and functionality. I'll use the code-suggestions format to outline the proposed changes.

\`\`\`code-suggestions
[
  {
    "file": "template/train.py",
    "description": "Add type hints and docstrings for better code clarity",
    "newCode": "import typing\\nfrom typing import Dict, Any, Optional\\n\\ndef train(\\n config: Dict[str, Any],\\n model_dir: Optional[str] = None\\n) -> Dict[str, float]:\\n \\\"\\\"\\\"\\n Train a machine learning model based on the provided configuration.\\n\\n Args:\\n config (Dict[str, Any]): Configuration dictionary containing training parameters.\\n model_dir (Optional[str], optional): Directory to save the trained model. Defaults to None.\\n\\n Returns:\\n Dict[str, float]: A dictionary of training metrics.\\n \\\"\\\"\\\"\\n # Existing training logic here\\n pass"
  },
  {
    "file": "template/train.py",
    "description": "Add logging and error handling",
    "newCode": "import logging\\nimport sys\\n\\nlogging.basicConfig(\\n level=logging.INFO,\\n format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',\\n handlers=[\\n logging.StreamHandler(sys.stdout),\\n logging.FileHandler('training.log')\\n ]\\n)\\n\\nlogger = logging.getLogger(__name__)\\n\\ndef train(config: Dict[str, Any], model_dir: Optional[str] = None) -> Dict[str, float]:\\n try:\\n logger.info(f'Starting training with config: {config}')\\n \\n # Validation of input config\\n if not config:\\n raise ValueError('Configuration cannot be empty')\\n \\n # Existing training logic\\n results = {}\\n \\n logger.info('Training completed successfully')\\n return results\\n \\n except Exception as e:\\n logger.error(f'Training failed: {str(e)}', exc_info=True)\\n raise"
  },
  {
    "file": "template/train.py",
    "description": "Add progress tracking and early stopping",
    "newCode": "import time\\nfrom dataclasses import dataclass\\n\\n@dataclass\\nclass EarlyStoppingConfig:\\n patience: int = 3\\n min_delta: float = 0.001\\n\\ndef early_stopping(\\n metric_history: list, \\n config: EarlyStoppingConfig = EarlyStoppingConfig()\\n) -> bool:\\n \\\"\\\"\\\"\\n Determine if training should be stopped early based on performance.\\n\\n Args:\\n metric_history (list): List of performance metrics\\n config (EarlyStoppingConfig): Early stopping configuration\\n\\n Returns:\\n bool: Whether to stop training\\n \\\"\\\"\\\"\\n if len(metric_history) < config.patience:\\n return False\\n \\n recent_metrics = metric_history[-config.patience:]\\n best_metric = max(recent_metrics)\\n return all(\\n best_metric - metric >= config.min_delta\\n for metric in recent_metrics\\n )\\n\\ndef train(config: Dict[str, Any], model_dir: Optional[str] = None) -> Dict[str, float]:\\n metric_history = []\\n start_time = time.time()\\n max_training_time = config.get('max_training_time', 3600) # Default 1 hour\\n\\n while time.time() - start_time < max_training_time:\\n # Training iteration logic\\n current_metric = 0.0 # Replace with actual metric calculation\\n metric_history.append(current_metric)\\n\\n if early_stopping(metric_history):\\n logger.info('Early stopping triggered')\\n break\\n\\n return {'best_metric': max(metric_history) if metric_history else 0.0}"
  }
]
\`\`\`

These suggestions improve the \`template/train.py\` file in several ways:

1. **Type Hints and Docstrings**:
- Added type hints to improve code readability and enable better IDE support
- Included comprehensive docstrings explaining function purpose, arguments, and return values

2. **Logging and Error Handling**:
- Implemented a robust logging system with console and file logging
- Added error handling with informative logging
- Included input validation
- Provides better visibility into the training process

3. **Progress Tracking and Early Stopping**:
- Introduced an \`EarlyStoppingConfig\` dataclass for configurable early stopping
- Created an \`early_stopping()\` function to intelligently halt training
- Added a time-based training limit
- Provides more control and efficiency in the training process`;

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'I need to create a PyTorch training script with best practices',
    type: 'user',
  },
  {
    id: '2',
    content: 'I\'ll help you create a comprehensive PyTorch training script with best practices. Here\'s a well-structured implementation:```code```',
    type: 'system',
    codeBlocks: [pythonCodeData[0]]
  },
  {
    id: '3',
    content: '```code```Next, let\'s implement a robust training loop with validation, logging, and model checkpointing:```code```',
    type: 'system',
    codeBlocks: [pythonCodeData[1], pythonCodeData[2]]
  },
  {
    id: '4',
    content: codeSuggestionsExample,
    type: 'system',
  }
];

const ConsoleInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
    };
    
    setMessages([...messages, newMessage]);
    // Simulate a response
    setIsGenerating(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Generating',
        type: 'loading',
      }]);
    }, 500);
  };

  const handleStopGenerating = () => {
    setIsGenerating(false);
    setMessages(prev => prev.filter(msg => msg.type !== 'loading'));
  };

  const handleAcceptGenerating = () => {
    setIsGenerating(false);
    setMessages(prev => {
      const newMessages = prev.filter(msg => msg.type !== 'loading');
      return [
        ...newMessages, 
        {
          id: Date.now().toString(),
          content: 'The training script is now complete with argument parsing, a comprehensive training loop with validation, and a main function to tie everything together. You can run this script with various command line arguments like:\n\n```python train.py --epochs 50 --learning_rate 0.0005 --batch_size 32```',
          type: 'system',
        }
      ];
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[var(--vscode-editor-bg)] vscode-dark">
      <ConsoleHeader title="PyTorch Training Script Generator" />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-2 border-b border-[var(--vscode-border)] bg-[#2d2d2d]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="vscode-terminal-command">
              <span className="text-[#C586C0] mr-2">python</span> generate_training_script.py
            </div>
          </div>
        </div>
        
        {messages.map((message) => (
          <MessageBlock 
            key={message.id}
            content={message.content}
            type={message.type}
            codeBlocks={message.codeBlocks}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ConsoleInput 
        onSendMessage={handleSendMessage} 
        isGenerating={isGenerating}
        onStop={handleStopGenerating}
        onAccept={handleAcceptGenerating}
      />
    </div>
  );
};

export default ConsoleInterface;
