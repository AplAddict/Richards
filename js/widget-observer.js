// Widget Container Style Observer (moved from inline)
window.addEventListener('load', function() {
  const targetNode = document.getElementById('widget-container');
  
  if (!targetNode) return;
  
  const config = { attributes: true, childList: true, subtree: true };
  
  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        targetNode.style.clipPath = 'inset(0 33.33% 0 0)';
        targetNode.style.overflow = 'hidden';
      }
    }
  };
  
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
});
