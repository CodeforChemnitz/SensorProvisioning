(function(){
  "use strict";

  function TaskController($q, fileSystemService) {
    var vm = this;

    vm.allTasks = [];
    vm.newTask =  '';

    vm.addTask = function() {
      if (vm.newTask !== '') {
        vm.allTasks.push({title: vm.newTask, isCompleted: false});
        vm.newTask = '';
      }
    };

    vm.deleteTask = function(task) {
      var index = null;
      for (var i = vm.allTasks.length - 1; i >= 0; i--) {
        if (vm.allTasks[i].title === task.title) {
          index = i;
        }
      }
      if (index !== null) {
        vm.allTasks.splice(index, 1);
      }
    };

    vm.showRepo = function() {
      gui.Shell.openExternal('https://github.com/CodeforChemnitz/SensorProvisioning/tree/nwjs');
    };
  }
  angular.module("nwtaskify").controller("taskController", TaskController);
})();
