CCMM.params = new URLSearchParams(document.currentScript.src.split('?')[1]);
CCMM.ModInjection(CCMM.params.get('mod'));