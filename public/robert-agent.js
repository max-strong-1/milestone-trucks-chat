/**
 * Robert Agent - Client-side JavaScript for ElevenLabs Widget
 * 
 * This file implements 4 client-side tools that run in the browser:
 * 1. navigate_to - Navigate to different pages
 * 2. calculate_quantity - Convert dimensions to cubic yards
 * 3. update_session_state - Save data to sessionStorage
 * 4. get_session_state - Retrieve data from sessionStorage
 */

(function() {
  'use strict';

  const CONFIG = {
    agentId: 'agent_0401kav5erfpe4jah92jpt04zvjf',
    debug: true, // Set to false in production
  };

  /**
   * Initialize the Robert Agent when ElevenLabs widget is ready
   */
  function initializeRobertAgent() {
    // Wait for ElevenLabs SDK to load
    if (typeof window.ElevenLabs === 'undefined' || !window.ElevenLabs.Conversation) {
      console.log('⏳ Waiting for ElevenLabs SDK...');
      setTimeout(initializeRobertAgent, 500);
      return;
    }

    console.log('🚀 Initializing Robert Agent...');

    // Create conversation instance with client tools
    const conversation = window.ElevenLabs.Conversation({
      agentId: CONFIG.agentId,
      
      onConnect: () => {
        if (CONFIG.debug) console.log('🟢 Robert connected');
      },
      
      onDisconnect: () => {
        if (CONFIG.debug) console.log('🔴 Robert disconnected');
      },
      
      onMessage: (message) => {
        if (CONFIG.debug) console.log('💬 Robert message:', message);
      },
      
      onModeChange: (mode) => {
        if (CONFIG.debug) console.log('🔄 Mode changed:', mode);
      },
      
      // CRITICAL: Client tools definition
      clientTools: {
        
        /**
         * TOOL 1: Navigate to page
         * Takes the user to a different page on the website
         */
        navigate_to: async function(parameters) {
          const { page_slug } = parameters;
          
          if (CONFIG.debug) console.log('📍 Navigate to:', page_slug);
          
          try {
            // Validate input
            if (!page_slug) {
              return {
                success: false,
                error: "page_slug is required"
              };
            }
            
            // Handle different URL formats
            let targetUrl;
            
            if (page_slug.startsWith('http://') || page_slug.startsWith('https://')) {
              // Absolute URL
              targetUrl = page_slug;
            } else if (page_slug.startsWith('/')) {
              // Root-relative URL
              targetUrl = window.location.origin + page_slug;
            } else {
              // Relative to current path
              targetUrl = window.location.origin + '/' + page_slug;
            }
            
            // Navigate
            window.location.href = targetUrl;
            
            return {
              success: true,
              message: `Navigating to ${page_slug}`,
              url: targetUrl
            };
            
          } catch (error) {
            console.error('Navigation error:', error);
            return {
              success: false,
              error: error.message
            };
          }
        },
        
        /**
         * TOOL 2: Calculate quantity
         * Converts dimensions to cubic yards needed
         */
        calculate_quantity: function(parameters) {
          const { length_ft, width_ft, depth_in } = parameters;
          
          if (CONFIG.debug) console.log('🧮 Calculate:', { length_ft, width_ft, depth_in });
          
          try {
            // Validate inputs
            if (!length_ft || !width_ft || !depth_in) {
              return {
                success: false,
                error: "length_ft, width_ft, and depth_in are required"
              };
            }
            
            // Convert to numbers
            const length = parseFloat(length_ft);
            const width = parseFloat(width_ft);
            const depth_inches = parseFloat(depth_in);
            
            if (isNaN(length) || isNaN(width) || isNaN(depth_inches)) {
              return {
                success: false,
                error: "All measurements must be valid numbers"
              };
            }
            
            if (length <= 0 || width <= 0 || depth_inches <= 0) {
              return {
                success: false,
                error: "All measurements must be greater than zero"
              };
            }
            
            // Calculate volume
            const depth_feet = depth_inches / 12;
            const cubic_feet = length * width * depth_feet;
            const cubic_yards = cubic_feet / 27;
            
            // Round up to nearest 0.5 cubic yards (common industry practice)
            const rounded_yards = Math.ceil(cubic_yards * 2) / 2;
            
            return {
              success: true,
              cubic_yards: rounded_yards,
              cubic_feet: Math.round(cubic_feet * 10) / 10,
              inputs: {
                length_ft: length,
                width_ft: width,
                depth_in: depth_inches
              },
              formula: `${length} ft × ${width} ft × ${depth_inches} in = ${rounded_yards} cubic yards`
            };
            
          } catch (error) {
            console.error('Calculation error:', error);
            return {
              success: false,
              error: error.message
            };
          }
        },
        
        /**
         * TOOL 3: Update session state
         * Saves data to browser's sessionStorage
         */
        update_session_state: function(parameters) {
          const { key, value } = parameters;
          
          if (CONFIG.debug) console.log('💾 Save state:', key, '=', value);
          
          try {
            // Validate inputs
            if (!key) {
              return {
                success: false,
                error: "key is required"
              };
            }
            
            // Get existing state
            let state = {};
            const stored = sessionStorage.getItem('robert_session');
            
            if (stored) {
              try {
                state = JSON.parse(stored);
              } catch (e) {
                console.warn('Could not parse stored state, starting fresh');
                state = {};
              }
            }
            
            // Update state
            state[key] = value;
            state._updated_at = new Date().toISOString();
            
            // Save back to sessionStorage
            sessionStorage.setItem('robert_session', JSON.stringify(state));
            
            return {
              success: true,
              key: key,
              value: value,
              message: `Saved ${key} to session`
            };
            
          } catch (error) {
            console.error('Session storage error:', error);
            return {
              success: false,
              error: error.message
            };
          }
        },
        
        /**
         * TOOL 4: Get session state
         * Retrieves data from browser's sessionStorage
         */
        get_session_state: function(parameters) {
          const { key } = parameters;
          
          if (CONFIG.debug) console.log('📖 Read state:', key || 'ALL');
          
          try {
            const stored = sessionStorage.getItem('robert_session');
            
            if (!stored) {
              return {
                success: true,
                message: "No session data found",
                state: {}
              };
            }
            
            const state = JSON.parse(stored);
            
            // Return specific key or entire state
            if (key) {
              return {
                success: true,
                key: key,
                value: state[key] !== undefined ? state[key] : null,
                message: state[key] !== undefined ? `Found ${key}` : `${key} not found in session`
              };
            } else {
              return {
                success: true,
                state: state,
                keys: Object.keys(state).filter(k => k !== '_updated_at'),
                message: `Session contains ${Object.keys(state).length} items`
              };
            }
            
          } catch (error) {
            console.error('Session read error:', error);
            return {
              success: false,
              error: error.message
            };
          }
        }
        
      } // End clientTools
      
    });
    
    console.log('✅ Robert Agent: Fully initialized and ready!');
    
    // Store conversation instance globally for debugging
    if (CONFIG.debug) {
      window.robertAgent = conversation;
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRobertAgent);
  } else {
    initializeRobertAgent();
  }

})();
