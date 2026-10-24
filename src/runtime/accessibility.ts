  var _lteReduceMotion = getLocal("reduce_motion", false);
  function applyReduceMotion(enabled) {
    _lteReduceMotion = Boolean(enabled);
    setLocal("reduce_motion", _lteReduceMotion);
    document.documentElement.setAttribute("data-lte-reduce-motion", _lteReduceMotion ? "1" : "0");
    window._lteReduceMotion = _lteReduceMotion;
  }
  function getReduceMotion() {
    return _lteReduceMotion;
  }
  function installReduceMotion() {
    applyReduceMotion(getLocal("reduce_motion", false));
  }
  function disposeReduceMotion() {
    document.documentElement.removeAttribute("data-lte-reduce-motion");
  }
