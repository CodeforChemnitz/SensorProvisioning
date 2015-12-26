
function workflow_step1() {
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $('.step1 .weiter').on('click', function() {
    // TODO muss wieder raus, umschalten automatisch wenn IP erreicht wird (und Sensor antwortet)
    $step1.fadeOut(function() { $step2.fadeIn('slow', function() { init_step2(); }); });
  });
}

function init_step1() {

}
