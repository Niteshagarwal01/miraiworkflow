// Enhanced navigation and flowchart interaction system
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFlowchartInteractions();
    initializeScrollEffects();
    initializeZoomControls(); // Initialize the external zoom controls
});

// Navigation System
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Flowchart Interaction System with enhanced visualization
function initializeFlowchartInteractions() {
    const flowNodes = document.querySelectorAll('.flow-node');
    const flowchart = document.querySelector('.flowchart-svg');
    
    // Add zoom controls to the flowchart on mobile
    if (window.innerWidth <= 992) {
        addZoomControls();
    }
    
    // Add entrance animations for nodes
    flowNodes.forEach((node, index) => {
        // Initial state - invisible
        node.style.opacity = '0';
        node.style.transform = 'scale(0.8)';
        
        // Animate entrance with staggered delay
        setTimeout(() => {
            node.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            node.style.opacity = '1';
            node.style.transform = 'scale(1)';
        }, 100 + (index * 100)); // Faster staggered delay for each node
        
        // Mouse interactions
        node.addEventListener('mouseenter', function() {
            // Add enhanced glow effect on hover
            if (this.classList.contains('process-node')) {
                this.style.filter = 'drop-shadow(0 0 15px rgba(249, 198, 54, 0.5))';
            } else if (this.classList.contains('system-node')) {
                this.style.filter = 'drop-shadow(0 0 15px rgba(249, 198, 54, 0.5))';
            } else if (this.classList.contains('decision-node')) {
                this.style.filter = 'drop-shadow(0 0 15px rgba(241, 238, 234, 0.5))';
            } else {
                this.style.filter = 'drop-shadow(0 0 15px rgba(249, 198, 54, 0.5))';
            }
            
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '100';
            
            // Highlight connected arrows when hovering on a node
            highlightConnectedArrows(this);
            
            // Add tooltip with node title for better UX
            showTooltip(this);
        });
        
        node.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.filter = '';
            this.style.transform = 'scale(1)';
            this.style.zIndex = '';
            
            // Reset arrows
            resetArrows();
            
            // Hide tooltip
            hideTooltip();
        });
        
        // Click interaction to show node details
        node.addEventListener('click', function() {
            showFlowNodeDetails(this);
        });
        
        // Add accessibility attributes
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'button');
        node.setAttribute('aria-label', getNodeLabel(node));
        
        // Keyboard navigation
        node.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showFlowNodeDetails(this);
            }
        });
    });

    // Function to get node label for accessibility
    function getNodeLabel(node) {
        // Try to find text elements within the node
        const textElements = node.querySelectorAll('text');
        if (textElements.length > 0) {
            return Array.from(textElements)
                .map(el => el.textContent.trim())
                .filter(text => text)
                .join(', ');
        }
        return 'Flowchart node';
    }

    // Add smooth animations to arrows with enhanced visuals based on color scheme
    const arrows = document.querySelectorAll('.flow-arrow');
    arrows.forEach((arrow, index) => {
        if (arrow.classList.contains('yes')) {
            arrow.style.animation = `greenFlowPulse 3s infinite alternate`;
            arrow.style.animationDelay = `${index * 0.2}s`;
        } else if (arrow.classList.contains('no')) {
            arrow.style.animation = `redFlowPulse 3s infinite alternate`;
            arrow.style.animationDelay = `${index * 0.2}s`;
        } else {
            arrow.style.animation = `yellowFlowPulse 3s infinite alternate`;
            arrow.style.animationDelay = `${index * 0.2}s`;
        }
    });
    
    // Add CSS for flowing arrows animation with multiple colors
    const style = document.createElement('style');
    style.textContent = `
        @keyframes yellowFlowPulse {
            0% { stroke-width: 2px; filter: drop-shadow(0 0 1px rgba(249, 198, 54, 0.2)); }
            100% { stroke-width: 2.5px; filter: drop-shadow(0 0 4px rgba(249, 198, 54, 0.4)); }
        }
        
        @keyframes greenFlowPulse {
            0% { stroke-width: 2px; filter: drop-shadow(0 0 1px rgba(52, 168, 83, 0.2)); }
            100% { stroke-width: 2.5px; filter: drop-shadow(0 0 4px rgba(52, 168, 83, 0.4)); }
        }
        
        @keyframes redFlowPulse {
            0% { stroke-width: 2px; filter: drop-shadow(0 0 1px rgba(234, 67, 53, 0.2)); }
            100% { stroke-width: 2.5px; filter: drop-shadow(0 0 4px rgba(234, 67, 53, 0.4)); }
        }
        
        .tooltip {
            position: absolute;
            background: rgba(17, 17, 17, 0.95);
            color: #FFFFFF;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            border: 1px solid rgba(249, 198, 54, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            max-width: 200px;
        }
        
        .zoom-controls {
            position: absolute;
            bottom: 15px;
            right: 15px;
            display: flex;
            gap: 8px;
            z-index: 100;
        }
        
        .zoom-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #111111;
            color: #F9C636;
            border: 1px solid #F9C636;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }
        
        .zoom-btn:hover {
            background: #F9C636;
            color: #111111;
        }
    `;
    document.head.appendChild(style);
    
    // Function to highlight connected arrows for a specific node with improved accuracy
    function highlightConnectedArrows(node) {
        // Get all arrows
        const arrows = document.querySelectorAll('.flow-arrow');
        
        // First, reduce opacity for all arrows
        arrows.forEach(arrow => {
            arrow.style.opacity = '0.3';
            arrow.style.transition = 'opacity 0.3s ease, stroke-width 0.2s ease, filter 0.2s ease';
        });
        
        // Get node ID or position to determine connections more accurately
        const nodeId = node.id || '';
        const nodeRect = node.getBoundingClientRect();
        const svgRect = flowchart.getBoundingClientRect();
        
        // Normalize coordinates relative to SVG
        const nodeCenterX = nodeRect.left + nodeRect.width / 2 - svgRect.left;
        const nodeCenterY = nodeRect.top + nodeRect.height / 2 - svgRect.top;
        
        // Find and highlight relevant arrows with improved calculation
        arrows.forEach(arrow => {
            const arrowPath = arrow.getAttribute('d');
            
            // If we have path data, check if this arrow is connected to the node
            if (arrowPath) {
                // Parse path to get endpoints
                const points = arrowPath.split(' ');
                let isConnected = false;
                
                // Check if any point in the path is near the node center
                for (let i = 0; i < points.length; i++) {
                    if (points[i] === 'M' || points[i] === 'L') {
                        const x = parseFloat(points[i+1]);
                        const y = parseFloat(points[i+2]);
                        
                        // Calculate distance to node center
                        const distance = Math.sqrt(
                            Math.pow(nodeCenterX - x, 2) + 
                            Math.pow(nodeCenterY - y, 2)
                        );
                        
                        // If point is close to node, consider it connected
                        if (distance < 80) {
                            isConnected = true;
                            break;
                        }
                    }
                }
                
                // If connected, highlight this arrow
                if (isConnected) {
                    arrow.style.opacity = '1';
                    
                    // Apply different highlight styles based on arrow type
                    if (arrow.classList.contains('yes')) {
                        arrow.style.strokeWidth = '3';
                        arrow.style.filter = 'drop-shadow(0 0 6px rgba(52, 168, 83, 0.6))';
                    } else if (arrow.classList.contains('no')) {
                        arrow.style.strokeWidth = '3';
                        arrow.style.filter = 'drop-shadow(0 0 6px rgba(234, 67, 53, 0.6))';
                    } else {
                        arrow.style.strokeWidth = '3'; 
                        arrow.style.filter = 'drop-shadow(0 0 6px rgba(249, 198, 54, 0.6))';
                    }
                }
            }
        });
    }
    
    // Reset all arrows to default state
    function resetArrows() {
        const arrows = document.querySelectorAll('.flow-arrow');
        arrows.forEach(arrow => {
            arrow.style.opacity = '1';
            arrow.style.strokeWidth = '';
            arrow.style.filter = '';
        });
    }
    
    // Enhanced tooltip functions with more context
    function showTooltip(node) {
        // Find the node text elements
        const textElements = node.querySelectorAll('text');
        if (textElements.length === 0) return;
        
        // Gather text content from all text elements
        let tooltipContent = '';
        let nodeTitle = '';
        
        textElements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (index === 0 && text) {
                nodeTitle = text;
            } else if (text) {
                tooltipContent += (tooltipContent ? ' - ' : '') + text;
            }
        });
        
        // Create tooltip with improved content
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        
        // Add node type hint based on class
        let nodeType = '';
        if (node.classList.contains('start-end-node')) {
            nodeType = '<span style="color:#F9C636;font-weight:600;display:block;margin-bottom:4px">Start/End Node</span>';
        } else if (node.classList.contains('process-node')) {
            nodeType = '<span style="color:#F9C636;font-weight:600;display:block;margin-bottom:4px">Process Node</span>';
        } else if (node.classList.contains('decision-node')) {
            nodeType = '<span style="color:#F9C636;font-weight:600;display:block;margin-bottom:4px">Decision Node</span>';
        } else if (node.classList.contains('system-node')) {
            nodeType = '<span style="color:#F9C636;font-weight:600;display:block;margin-bottom:4px">System Node</span>';
        }
        
        tooltip.innerHTML = `
            ${nodeType}
            <strong>${nodeTitle}</strong>
            ${tooltipContent ? `<span style="opacity:0.8;display:block;margin-top:2px;font-size:12px">${tooltipContent}</span>` : ''}
            <span style="font-style:italic;opacity:0.6;display:block;margin-top:4px;font-size:11px">Click for more details</span>
        `;
        
        // Position tooltip with improved positioning
        const nodeRect = node.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Determine if tooltip should appear above or below the node
        const spaceAbove = nodeRect.top;
        const spaceBelow = viewportHeight - nodeRect.bottom;
        const tooltipHeight = 80; // Estimated height
        
        if (spaceAbove > tooltipHeight || spaceAbove > spaceBelow) {
            // Position above
            tooltip.style.left = `${nodeRect.left + (nodeRect.width / 2)}px`;
            tooltip.style.top = `${nodeRect.top - 10}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
        } else {
            // Position below
            tooltip.style.left = `${nodeRect.left + (nodeRect.width / 2)}px`;
            tooltip.style.top = `${nodeRect.bottom + 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
        }
        
        // Add to DOM and animate
        document.body.appendChild(tooltip);
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        }
    }
    
    // Enhanced zoom controls with improved UX
    function addZoomControls() {
        const container = document.querySelector('.flowchart-container');
        if (!container) return;
        
        // Create zoom controls with tooltips and ARIA labels
        const controls = document.createElement('div');
        controls.className = 'zoom-controls';
        controls.innerHTML = `
            <button class="zoom-btn zoom-in" aria-label="Zoom in" title="Zoom in">+</button>
            <button class="zoom-btn zoom-out" aria-label="Zoom out" title="Zoom out">−</button>
            <button class="zoom-btn zoom-reset" aria-label="Reset zoom" title="Reset zoom">↺</button>
        `;
        
        // Ensure container has relative positioning
        container.style.position = 'relative';
        container.appendChild(controls);
        
        // Current scale with more granular control
        let currentScale = 1;
        let minScale = 0.5;
        let maxScale = 1.5;
        let scaleStep = 0.1;
        
        // Add zoom level indicator
        const zoomIndicator = document.createElement('div');
        zoomIndicator.className = 'zoom-indicator';
        zoomIndicator.style.cssText = `
            position: absolute;
            bottom: 15px;
            left: 15px;
            background: rgba(17,17,17,0.8);
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        zoomIndicator.textContent = '100%';
        container.appendChild(zoomIndicator);
        
        // Show zoom indicator for 2 seconds
        function showZoomLevel(scale) {
            zoomIndicator.textContent = `${Math.round(scale * 100)}%`;
            zoomIndicator.style.opacity = '1';
            clearTimeout(zoomIndicator.timeout);
            zoomIndicator.timeout = setTimeout(() => {
                zoomIndicator.style.opacity = '0';
            }, 2000);
        }
        
        // Zoom in with smoother animation
        controls.querySelector('.zoom-in').addEventListener('click', () => {
            currentScale = Math.min(maxScale, currentScale + scaleStep);
            applyZoom();
            showZoomLevel(currentScale);
        });
        
        // Zoom out with smoother animation
        controls.querySelector('.zoom-out').addEventListener('click', () => {
            currentScale = Math.max(minScale, currentScale - scaleStep);
            applyZoom();
            showZoomLevel(currentScale);
        });
        
        // Reset zoom with bounce effect
        controls.querySelector('.zoom-reset').addEventListener('click', () => {
            currentScale = 1;
            flowchart.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            applyZoom();
            showZoomLevel(currentScale);
            
            // Reset transition after bounce effect
            setTimeout(() => {
                flowchart.style.transition = 'transform 0.3s ease';
            }, 400);
        });
        
        // Improved zoom application with better origin control
        function applyZoom() {
            flowchart.style.transform = `scale(${currentScale})`;
            flowchart.style.transformOrigin = 'center center';
            if (!flowchart.style.transition) {
                flowchart.style.transition = 'transform 0.3s ease';
            }
            
            // Update accessibility attributes
            flowchart.setAttribute('aria-label', `Flowchart at ${Math.round(currentScale * 100)}% zoom level`);
        }
        
        // Add keyboard controls for zoom
        container.tabIndex = 0; // Make container focusable
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Zoomable flowchart');
        
        container.addEventListener('keydown', (e) => {
            if (e.key === '+' || e.key === '=') {
                // Zoom in with + key
                currentScale = Math.min(maxScale, currentScale + scaleStep);
                applyZoom();
                showZoomLevel(currentScale);
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                // Zoom out with - key
                currentScale = Math.max(minScale, currentScale - scaleStep);
                applyZoom();
                showZoomLevel(currentScale);
                e.preventDefault();
            } else if (e.key === '0') {
                // Reset with 0 key
                currentScale = 1;
                applyZoom();
                showZoomLevel(currentScale);
                e.preventDefault();
            }
        });
        
        // Add pinch zoom support for touch devices
        let initialDistance = 0;
        let initialScale = 1;
        
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialScale = currentScale;
                e.preventDefault();
            }
        }, { passive: false });
        
        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const distance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                const newScale = Math.min(Math.max(
                    initialScale * (distance / initialDistance),
                    minScale
                ), maxScale);
                
                if (Math.abs(newScale - currentScale) > 0.01) {
                    currentScale = newScale;
                    applyZoom();
                    showZoomLevel(currentScale);
                }
                
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Show details for flowchart nodes
function showFlowNodeDetails(node) {
    const nodeText = node.querySelector('.node-text') || node.parentElement.querySelector('.node-text');
    if (!nodeText) return;
    
    const nodeName = nodeText.textContent;
    let details = getFlowNodeDetails(nodeName);
    
    // Create modal for details
    showModal(`${nodeName} Details`, details);
}

// Get details for each flowchart node with enhanced formatting
function getFlowNodeDetails(nodeName) {
    const nodeDetails = {
        'User Login': {
            description: 'User accesses the Mirai platform and logs in using Clerk authentication with support for email/password and social logins.',
            technicalDetails: 'Implemented with Clerk.dev authentication service that provides secure JWT-based authentication and session management.',
            userExperience: 'Seamless login experience with social auth options (Google, Twitter, LinkedIn) and passwordless magic link options.',
            nextStep: 'After successful authentication, users are directed to their personalized dashboard.'
        },
        'Select Content': {
            description: 'Choose content type (Instagram, LinkedIn, Twitter, Blog) and specify platform-specific requirements and preferences.',
            technicalDetails: 'Dynamic form generation based on selected platform with field validation and character limit indicators.',
            userExperience: 'Intuitive UI with platform-specific tips and best practices shown alongside input fields.',
            nextStep: 'Content specifications are passed to the AI processing engine with appropriate platform markers.'
        },
        'User Authenticated?': {
            description: 'System checks if user has valid authentication session and appropriate permissions to access content generation features.',
            technicalDetails: 'Server-side validation of JWT tokens and permission checks against user role database.',
            userExperience: 'Unauthenticated users are redirected to login page with return URL parameter to continue their journey after authentication.',
            nextStep: 'Authenticated users proceed to content selection, while unauthenticated users are redirected to login.'
        },
        'Pro Plan?': {
            description: 'Verify if user has active Pro subscription to access advanced features and unlimited content generation.',
            technicalDetails: 'Subscription status checked against Stripe Customer Portal API with caching for performance.',
            userExperience: 'Free users see upgrade prompts with clear benefits comparison, while Pro users get access to all premium features.',
            nextStep: 'Pro users continue to AI processing, free users with quota remaining proceed or are prompted to upgrade.'
        },
        'Upgrade to Pro': {
            description: 'Redirect to payment page with Razorpay integration for seamless subscription upgrade and plan management.',
            technicalDetails: 'Secure payment processing with Razorpay API integration, including webhooks for subscription state management.',
            userExperience: 'Simple pricing page with monthly/annual options and transparent feature comparison.',
            nextStep: 'After successful payment, users are redirected back to their workflow with newly activated Pro features.'
        },
        'AI Processing': {
            description: 'Content request is sent to AI network with intelligent routing through 6 providers (Groq, OpenAI, Cohere, HuggingFace, Claude, Gemini).',
            technicalDetails: 'Load balancing algorithm selects optimal AI provider based on request type, response time, and quality metrics.',
            userExperience: 'Real-time processing indicators with estimated completion time based on request complexity.',
            nextStep: 'Processed content is sent to content generation engine for final formatting and optimization.'
        },
        'Generate Content': {
            description: 'AI creates platform-optimized content with customizable tone, length, and style based on user requirements.',
            technicalDetails: 'Multi-stage processing pipeline with platform-specific formatting, hashtag optimization, and engagement enhancement.',
            userExperience: 'Live preview updates as content is generated with tone and style controls available during generation.',
            nextStep: 'Generated content is presented to user for review and approval before saving or download.'
        },
        'Content Approved?': {
            description: 'User reviews generated content and can either approve for saving/download or request regeneration with modifications.',
            technicalDetails: 'Feedback loop captures user preferences for future content generation and model fine-tuning.',
            userExperience: 'Inline editing capabilities with version history and A/B comparison between different generated versions.',
            nextStep: 'Approved content moves to save/download phase, while rejected content triggers regeneration with user feedback.'
        },
        'Save & Download': {
            description: 'Approved content is saved to user account and made available for download in multiple formats (text, image, PDF).',
            technicalDetails: 'Content stored in encrypted database with export functionality to various formats including API integration options.',
            userExperience: 'Download options include direct copy, formatted PDF, social-ready images, and scheduled posting integration.',
            nextStep: 'User can return to dashboard to create new content or access content library to view/edit past creations.'
        },
        'Business Planner?': {
            description: 'Optional feature to generate comprehensive business plans with market analysis, financial projections, and strategic recommendations.',
            technicalDetails: 'Advanced multi-model AI processing with domain-specific training for business planning and financial modeling.',
            userExperience: 'Guided input process with industry selection and key business parameters that influence plan generation.',
            nextStep: 'User inputs are processed to generate a complete business plan with customizable sections.'
        },
        'Generate Plan': {
            description: 'AI creates detailed business plan including executive summary, market analysis, financial projections, and implementation strategy.',
            technicalDetails: 'Domain-specific language models with financial modeling capabilities generate structured business documentation.',
            userExperience: 'Interactive plan generation with section-by-section preview and editing capabilities.',
            nextStep: 'Completed business plan is presented for user review and can be downloaded in multiple formats.'
        },
        'Process Complete': {
            description: 'Content generation workflow completed successfully with all requested outputs delivered to user.',
            technicalDetails: 'System logs completion status, updates user quotas, and prepares analytics data for dashboard updates.',
            userExperience: 'Success confirmation with suggested next steps and related content options.',
            nextStep: 'User can create new content, access their content library, or view analytics on content performance.'
        }
    };
    
    // Extract the actual node name from emoji and text
    const cleanNodeName = nodeName.replace(/^[^\p{L}]+/u, '').trim();
    
    for (const key in nodeDetails) {
        if (cleanNodeName.includes(key.replace(/^\?+/u, '').trim())) {
            const details = nodeDetails[key];
            return `
                <div class="node-detail-section">
                    <h4>Description</h4>
                    <p>${details.description}</p>
                </div>
                <div class="node-detail-section">
                    <h4>Technical Implementation</h4>
                    <p>${details.technicalDetails}</p>
                </div>
                <div class="node-detail-section">
                    <h4>User Experience</h4>
                    <p>${details.userExperience}</p>
                </div>
                <div class="node-detail-section">
                    <h4>Next Step</h4>
                    <p>${details.nextStep}</p>
                </div>
            `;
        }
    }
    
    // Default response if no specific details are found
    return `
        <div class="node-detail-section">
            <h4>About This Node</h4>
            <p>Interactive flowchart node in the Mirai AI content generation process.</p>
        </div>
        <div class="node-detail-section">
            <h4>More Information</h4>
            <p>Detailed information for this specific node is being developed. The complete workflow showcases Mirai's comprehensive content generation capabilities.</p>
        </div>
    `;
}

// Modal system for displaying node details
function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.flow-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'flow-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles with brand colors
    const style = document.createElement('style');
    style.textContent = `
        .flow-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .modal-overlay {
            background: rgba(26, 26, 26, 0.85);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .modal-content {
            background: #F1EEEA;
            border-radius: 15px;
            max-width: 550px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            transform: translateY(30px);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid #F9C636;
        }
        .modal-header {
            padding: 1.5rem;
            border-bottom: 2px solid #F9C636;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #F9C636;
        }
        .modal-header h3 {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            color: #1a1a1a;
            font-size: 1.5rem;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #1a1a1a;
            transition: transform 0.2s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .modal-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        .modal-body {
            padding: 1.75rem;
        }
        .modal-body p {
            margin: 0;
            line-height: 1.8;
            color: #1a1a1a;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
        }
        .node-detail-section {
            margin-bottom: 1.25rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid rgba(249, 198, 54, 0.3);
        }
        .node-detail-section:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .node-detail-section h4 {
            margin: 0 0 0.5rem 0;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            color: #1a1a1a;
            font-size: 1.1rem;
            position: relative;
            padding-left: 1rem;
        }
        .node-detail-section h4::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 18px;
            background-color: #F9C636;
            border-radius: 3px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Animation timing for entrance
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Function to handle modal closing with animation
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(30px)';
        
        // Remove after animation completes
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Header scroll effects
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', debounce(handleScroll, 10));
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization and animations
function optimizeAnimations() {
    const nodes = document.querySelectorAll('.flow-node');
    const flowchart = document.querySelector('.workflow-flowchart');
    
    // Use requestAnimationFrame for smooth animations
    nodes.forEach((node, index) => {
        // Staggered entrance animation for flowchart nodes
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            node.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
        }, 100 + (index * 80)); // Staggered delay
        
        // Optimize hover effects
        node.addEventListener('mouseenter', function() {
            requestAnimationFrame(() => {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    });
    
    // Add scroll reveal animations to key sections
    const sections = document.querySelectorAll('.workflow-section, .tech-stack-section');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('section-animated');
        sectionObserver.observe(section);
    });
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
        });
    });
    
    // Add custom CSS for animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .section-animated {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .section-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .highlight-pulse {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(animationStyles);
}

// Initialize optimizations and add responsive behavior
document.addEventListener('DOMContentLoaded', () => {
    optimizeAnimations();
    
    // Handle responsive behavior
    function handleResponsive() {
        const flowchart = document.querySelector('.workflow-flowchart');
        if (flowchart) {
            if (window.innerWidth < 768) {
                // Mobile optimizations
                flowchart.classList.add('mobile-view');
            } else {
                flowchart.classList.remove('mobile-view');
            }
        }
    }
    
    // Initial call and window resize listener
    handleResponsive();
    window.addEventListener('resize', debounce(handleResponsive, 250));
});