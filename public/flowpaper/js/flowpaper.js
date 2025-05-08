
/**
 * FlowPaper - Basic JavaScript PDF viewer
 * Version 1.0
 */

(function($) {
  $.fn.FlowPaperViewer = function(options) {
    // Default options
    const defaults = {
      config: {
        PDFFile: null,
        Scale: 1,
        FitPageOnLoad: true,
        FitWidthOnLoad: false,
        FullScreenAsMaxWindow: false,
        ViewModeToolsVisible: true,
        ZoomToolsVisible: true,
        NavToolsVisible: true,
        CursorToolsVisible: true,
        SearchToolsVisible: true,
        RenderingOrder: 'html5'
      }
    };
    
    const settings = $.extend(true, {}, defaults, options);
    
    return this.each(function() {
      const $this = $(this);
      const pdfUrl = settings.config.PDFFile;
      
      if (!pdfUrl) {
        console.error('FlowPaper: No PDF file provided');
        $this.html('<div class="flowpaper-error">No PDF file provided</div>');
        return;
      }
      
      // Create the PDF viewer structure
      const $viewer = $('<div/>', {
        'class': 'flowpaper-viewer'
      }).css({
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      });
      
      // Create the toolbar
      const $toolbar = $('<div/>', {
        'class': 'flowpaper-toolbar'
      }).css({
        width: '100%',
        height: '40px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px'
      });
      
      // Create the PDF container
      const $pdfContainer = $('<div/>', {
        'class': 'flowpaper-container'
      }).css({
        width: '100%',
        height: 'calc(100% - 40px)',
        overflow: 'auto',
        backgroundColor: '#f8f8f8'
      });
      
      // Create the PDF iframe
      const $iframe = $('<iframe/>', {
        src: pdfUrl,
        width: '100%',
        height: '100%',
        frameborder: '0'
      });
      
      // Build the viewer structure
      $pdfContainer.append($iframe);
      $viewer.append($toolbar);
      $viewer.append($pdfContainer);
      $this.append($viewer);
      
      // Add toolbar buttons if enabled
      if (settings.config.ZoomToolsVisible) {
        const $zoomIn = $('<button/>', {
          'class': 'flowpaper-btn flowpaper-zoom-in',
          text: '+'
        }).css(buttonStyle);
        
        const $zoomOut = $('<button/>', {
          'class': 'flowpaper-btn flowpaper-zoom-out',
          text: '-'
        }).css(buttonStyle);
        
        $toolbar.append($zoomIn);
        $toolbar.append($zoomOut);
      }
      
      if (settings.config.NavToolsVisible) {
        const $prev = $('<button/>', {
          'class': 'flowpaper-btn flowpaper-prev',
          text: '◀'
        }).css(buttonStyle);
        
        const $next = $('<button/>', {
          'class': 'flowpaper-btn flowpaper-next',
          text: '▶'
        }).css(buttonStyle);
        
        $toolbar.append($prev);
        $toolbar.append($next);
      }
      
      // Simple button style
      function buttonStyle() {
        return {
          margin: '0 5px',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          backgroundColor: '#fff',
          cursor: 'pointer'
        };
      }
    });
  };
})(jQuery);
