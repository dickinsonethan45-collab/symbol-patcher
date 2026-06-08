# Symbol Patcher

Batch update obfuscated IL2CPP symbols across multiple source files using a Frida-Map reference.

## Features

- **Multi-file support** — Drop multiple source files at once
- **Batch processing** — Apply the same patch map to all files
- **Multiple formats** — Supports .ts, .js, .cpp, .h, .cs files
- **Visual feedback** — Real-time status and file list
- **Individual downloads** — Download each patched file separately

## Usage

1. Upload your `Frida-Map.js` file (contains the new symbol mappings)
2. Drop your source files (the ones with old symbols)
3. Click "Patch All Files"
4. Download the patched files

## Local Development

```bash
npm install
npm start
```

Visit `http://localhost:3000`

## Deployment

### Railway

Connect this repo to Railway:

1. Push to GitHub
2. Create a new Railway project
3. Connect your GitHub repo
4. Railway will auto-detect `package.json` and start the server
5. Set `PORT` environment variable (Railway handles this automatically)

## How it Works

The patcher:
1. Parses `Frida-Map.js` to extract new symbol mappings
2. Scans source files for old symbol references (via `findExportByName` patterns)
3. Builds a replacement map: `old_symbol → new_symbol`
4. Applies regex replacements across all source files
5. Generates individual downloads for each patched file
