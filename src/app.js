// ... existing function definitions remain the same ...

    export function createApp() {
      const app = document.createElement('div')
      app.innerHTML = `
        <div class="container">
          <h1>File Chunker</h1>
          <div class="controls">
            <div class="input-group">
              <label for="fileInput">Select Files</label>
              <input type="file" id="fileInput" multiple>
            </div>
            
            <div class="input-group">
              <label for="formatSelect">Output Format</label>
              <select id="formatSelect">
                <option value="txt">Text (.txt)</option>
                <option value="md">Markdown (.md)</option>
                <option value="json">JSON (.json)</option>
              </select>
            </div>
            
            <div class="input-group">
              <label for="outputPrefix">Output Filename Prefix</label>
              <input type="text" id="outputPrefix" placeholder="Enter output filename prefix">
              <small class="hint">Leave blank to use original filenames</small>
            </div>
            
            <div class="input-group">
              <label for="chunkSize">Tokens per Chunk</label>
              <input type="number" id="chunkSize" placeholder="Enter token amount" min="1" required>
            </div>
            
            <div class="input-group">
              <label for="crossover">Crossover Tokens</label>
              <input type="number" id="crossover" placeholder="Enter overlap tokens" min="0" value="0">
              <small class="hint">Number of tokens to overlap between chunks</small>
            </div>
            
            <button id="processBtn">Process Files</button>
          </div>
          <div id="output"></div>
        </div>
      `
      
      // Link to CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/style.css'
      document.head.appendChild(link)
      
      app.querySelector('#processBtn').addEventListener('click', processFiles)
      return app
    }

    const processFiles = async () => {
      const files = document.getElementById('fileInput').files
      const format = document.getElementById('formatSelect').value
      const chunkSize = parseInt(document.getElementById('chunkSize').value)
      const crossover = parseInt(document.getElementById('crossover').value)
      const outputPrefix = document.getElementById('outputPrefix').value.trim()
      
      for (const file of files) {
        const content = await readFile(file)
        const chunks = chunkContent(content, chunkSize, crossover)
        saveChunks(chunks, file.name, format, outputPrefix)
      }
    }

    const saveChunks = (chunks, filename, format, prefix) => {
      const output = document.getElementById('output')
      const baseName = prefix || filename.replace(/\.[^/.]+$/, '')
      
      chunks.forEach((chunk, index) => {
        const content = format === 'json' ? 
          JSON.stringify({ 
            metadata: extractMetadata(chunk),
            content: chunk.split('\n\n').slice(1).join('\n\n')
          }) : 
          chunk
        
        const blob = new Blob([content], 
          { type: format === 'json' ? 'application/json' : `text/${format}` })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${baseName}_chunk_${index + 1}.${format}`
        link.textContent = `Download ${link.download}`
        link.className = 'download-link'
        output.appendChild(link)
        output.appendChild(document.createElement('br'))
      })
    }

    // ... rest of the functions remain the same ...
