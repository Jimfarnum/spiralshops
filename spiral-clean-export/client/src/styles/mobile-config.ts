// Mobile-Only Styling Configuration for SPIRAL Platform
export const mobileConfig = {
  // Screen size breakpoints
  breakpoints: {
    mobile: '(max-width: 768px)',
    mobileLarge: '(max-width: 480px)',
    mobileSmall: '(max-width: 320px)'
  },

  // Mobile-specific styling classes
  styles: {
    container: 'px-4 mx-auto max-w-sm',
    imageUpload: {
      dropZone: 'border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-gray-50 min-h-[200px] flex flex-col justify-center items-center',
      button: 'w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg mt-4 active:bg-blue-700 touch-manipulation',
      selectedFile: 'text-sm text-gray-600 p-2 bg-green-50 rounded border'
    },
    results: {
      list: 'space-y-3 mt-4',
      item: 'bg-white p-4 rounded-lg shadow-sm border border-gray-200',
      storeName: 'font-bold text-lg text-gray-900',
      distance: 'text-sm text-blue-600 font-medium',
      directions: 'inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium active:bg-blue-700'
    },
    layout: {
      header: 'text-center mb-6 px-4',
      title: 'text-2xl font-bold text-gray-900 mb-2',
      subtitle: 'text-gray-600 text-sm leading-relaxed'
    }
  },

  // Touch-friendly interactions
  interactions: {
    tapTargetSize: '44px', // Apple HIG minimum
    touchDelay: 0,
    scrollBehavior: 'smooth'
  },

  // Mobile performance optimizations
  performance: {
    lazyLoading: true,
    imageCompression: {
      maxWidth: 800,
      quality: 0.8,
      format: 'jpeg'
    }
  }
};

// CSS-in-JS mobile styles
export const mobileStyles = `
  @media ${mobileConfig.breakpoints.mobile} {
    .mobile-image-search {
      padding: 1rem;
      max-width: 100vw;
    }
    
    .mobile-drop-zone {
      min-height: 180px;
      border-radius: 12px;
      touch-action: manipulation;
    }
    
    .mobile-button {
      font-size: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      min-height: 44px;
      -webkit-tap-highlight-color: transparent;
    }
    
    .mobile-results {
      padding-top: 1rem;
    }
    
    .mobile-result-item {
      margin-bottom: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
    }
  }
  
  @media ${mobileConfig.breakpoints.mobileSmall} {
    .mobile-image-search {
      padding: 0.5rem;
    }
    
    .mobile-drop-zone {
      min-height: 160px;
      padding: 1rem;
    }
  }
`;