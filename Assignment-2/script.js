    const templates = [
            { id: 1, name: "Vadivelu Shocked", url: "1.jpeg" },
            { id: 2, name: "Vadivelu Thinking", url: "2.webp" },
            { id: 3, name: "Rajini Style", url: "3.webp" },
            { id: 4, name: "Vijay Mass", url: "4.webp" },
            { id: 5, name: "Sivakarthikeyan", url: "5.webp" },
            { id: 6, name: "Vivek Comedy", url: "6.gif" },
            { id: 7, name: "Santhanam", url: "7.webp" },
            { id: 8, name: "Suriya", url: "8.webp" },
            { id: 9, name: "Dhanush", url: "9.webp" },
            { id: 10, name: "Ajith Kumar", url: "10.webp" }
        ];

        let memes = [];
        let selectedTemplate = null;
        let editingMemeId = null;
        let uploadedFile = null;

        // Initialize the app
        function init() {
            displayTemplates();
            displayMemes();
        }

        // Display all template options
        function displayTemplates() {
            const grid = document.getElementById('templateGrid');
            grid.innerHTML = templates.map(template => `
                <div class="template-card" onclick="selectTemplate(${template.id}, this)">
                    <img src="${template.url}" alt="${template.name}">
                    <div class="template-name">${template.name}</div>
                </div>
            `).join('');
        }

        // Select a template
        function selectTemplate(templateId, element) {
            selectedTemplate = templates.find(t => t.id === templateId);
            uploadedFile = null; // Clear uploaded file
            document.getElementById('previewContainer').classList.remove('show');
            
            // Update visual selection
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });
            if (element) {
                element.classList.add('selected');
            }
        }

        // Handle file upload
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Clear template selection
            selectedTemplate = null;
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedFile = {
                    url: e.target.result,
                    name: file.name
                };
                
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('previewContainer').classList.add('show');
            };
            reader.readAsDataURL(file);
        }

        // Create a new meme
        function createMeme() {
            const topCaption = document.getElementById('topCaption').value;
            const bottomCaption = document.getElementById('bottomCaption').value;

            if (!selectedTemplate && !uploadedFile) {
                alert('⚠️ Please choose a meme template or upload your own image/GIF first!');
                return;
            }

            if (!topCaption && !bottomCaption) {
                alert('⚠️ Please add at least one caption!');
                return;
            }

            const templateToUse = uploadedFile || selectedTemplate;

            if (editingMemeId) {
                // Update existing meme
                const meme = memes.find(m => m.id === editingMemeId);
                meme.topCaption = topCaption;
                meme.bottomCaption = bottomCaption;
                meme.template = templateToUse;
                editingMemeId = null;
                document.getElementById('cancelBtn').style.display = 'none';
            } else {
                // Create new meme
                const newMeme = {
                    id: Date.now(),
                    template: templateToUse,
                    topCaption: topCaption,
                    bottomCaption: bottomCaption
                };
                memes.push(newMeme);
            }

            // Clear inputs
            document.getElementById('topCaption').value = '';
            document.getElementById('bottomCaption').value = '';
            document.getElementById('fileUpload').value = '';
            document.getElementById('previewContainer').classList.remove('show');
            selectedTemplate = null;
            uploadedFile = null;
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });

            displayMemes();
        }

        // Display all created memes
        function displayMemes() {
            const grid = document.getElementById('memesGrid');
            
            if (memes.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <p>😊 No memes yet!</p>
                        <p>Create your first meme using the form above!</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = memes.map(meme => `
                <div class="meme-card">
                    <div class="meme-image-container">
                        <img src="${meme.template.url}" alt="${meme.template.name || 'Uploaded meme'}">
                        ${meme.topCaption ? `<div class="meme-caption caption-top">${meme.topCaption}</div>` : ''}
                        ${meme.bottomCaption ? `<div class="meme-caption caption-bottom">${meme.bottomCaption}</div>` : ''}
                    </div>
                    <div class="meme-actions">
                        <button class="btn btn-edit" onclick="editMeme(${meme.id})">✏️ Edit</button>
                        <button class="btn btn-download" onclick="downloadMeme(${meme.id})">⬇️ Download</button>
                        <button class="btn btn-delete" onclick="deleteMeme(${meme.id})">🗑️ Delete</button>
                    </div>
                </div>
            `).join('');
        }

        
        // Edit a meme
        function editMeme(memeId) {
            const meme = memes.find(m => m.id === memeId);
            
            // Fill the form with meme data
            document.getElementById('topCaption').value = meme.topCaption;
            document.getElementById('bottomCaption').value = meme.bottomCaption;
            
            // Select the template
            selectTemplateById(meme.template.id);
            
            editingMemeId = memeId;
            document.getElementById('cancelBtn').style.display = 'inline-block';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }


        function selectTemplateById(templateId) {
            selectedTemplate = templates.find(t => t.id === templateId);
            document.querySelectorAll('.template-card').forEach((card, index) => {
                if (templates[index].id === templateId) {
                    card.classList.add('selected');
                } else {
                    card.classList.remove('selected');
                }
            });
        }

        // Cancel editing
        function cancelEdit() {
            editingMemeId = null;
            document.getElementById('topCaption').value = '';
            document.getElementById('bottomCaption').value = '';
            selectedTemplate = null;
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.getElementById('cancelBtn').style.display = 'none';
        }

        // Delete a meme
        function deleteMeme(memeId) {
            if (confirm('🤔 Are you sure you want to delete this meme?')) {
                memes = memes.filter(m => m.id !== memeId);
                displayMemes();
            }
        }



        async function downloadMeme(memeId) {
            const meme = memes.find(m => m.id === memeId);
            if (!meme) {
                alert('Meme not found!');
                return;
            }

            const imageUrl = meme.template.url;
            const isGif = imageUrl.toLowerCase().includes('.gif') ||
                (meme.template.name && meme.template.name.toLowerCase().includes('.gif'));

           
            if (isGif) {
                alert('🎬 GIF detected! Downloading original GIF (captions not added).');
                
                const a = document.createElement('a');
                a.href = imageUrl;
                const filename = (meme.template.name || `meme-gif-${Date.now()}`).replace(/\s/g, '-') + '.gif';
                a.download = filename; 
                
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                return; 
            }
           
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function() {
                const topBarHeight = img.height * 0.18;      // height for top caption area
                const bottomBarHeight = img.height * 0.18;   // height for bottom caption area

                // Set canvas size to image height + top bar + bottom bar
                canvas.width = img.width;
                canvas.height = img.height + topBarHeight + bottomBarHeight;

                // Draw top SOLID BLACK bar
                ctx.fillStyle = 'black'; // Solid black background
                ctx.fillRect(0, 0, canvas.width, topBarHeight);

                // Draw the image (starts below the top bar)
                ctx.drawImage(img, 0, topBarHeight, img.width, img.height);

                ctx.fillStyle = 'black'; // Solid black background
                ctx.fillRect(0, img.height + topBarHeight, canvas.width, bottomBarHeight);

                // Set up caption styles
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;

                function wrapText(ctx, text, x, y, maxWidth, lineHeight, barHeight) {
                    const words = text.split(' ');
                    let line = '';
                    const lines = [];
                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + ' ';
                        const testWidth = ctx.measureText(testLine).width;
                        if (testWidth > maxWidth && n > 0) {
                            lines.push(line.trim());
                            line = words[n] + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    lines.push(line.trim());
                    
                    const totalTextHeight = lines.length * lineHeight;
                
                    let startY = y + (barHeight - totalTextHeight) / 2 + lineHeight * 0.8;
                    
                    for (let i = 0; i < lines.length; i++) {
                        ctx.strokeText(lines[i], x, startY + i * lineHeight);
                        ctx.fillText(lines[i], x, startY + i * lineHeight);
                    }
                }

                // Utility: Fit text size (kept as is)
                function fitText(ctx, text, maxWidth, initialSize) {
                    let fontSize = initialSize;
                    ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
                    while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
                        fontSize -= 2;
                        ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
                    }
                    return fontSize;
                }

                const maxTextWidth = canvas.width * 0.9;
                const initialFontSize = Math.max(canvas.width / 15, 30);

                if (meme.topCaption) {
                    let fontSize = fitText(ctx, meme.topCaption, maxTextWidth, initialFontSize);
                    ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
                    ctx.lineWidth = fontSize / 10;
                    const lineHeight = fontSize * 1.1;
                    
                    wrapText(ctx, meme.topCaption.toUpperCase(), canvas.width / 2, 0, maxTextWidth, lineHeight, topBarHeight);
                }

                
                if (meme.bottomCaption) {
                    let fontSize = fitText(ctx, meme.bottomCaption, maxTextWidth, initialFontSize);
                    ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
                    ctx.lineWidth = fontSize / 10;
                    const lineHeight = fontSize * 1.1;
                    
                    const bottomBarY = img.height + topBarHeight;
                    wrapText(ctx, meme.bottomCaption.toUpperCase(), canvas.width / 2, bottomBarY, maxTextWidth, lineHeight, bottomBarHeight);
                }

                // Download image as PNG
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `meme-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/png');
            };

            img.onerror = function() {
                alert('⚠️ Sorry! Could not download this meme. Try creating it again!');
            };

            img.src = imageUrl;
        }


        init();