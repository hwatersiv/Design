module.exports = angular.module('marketplace.rotations', []);
// Rotation Views
require('./Rotations.ctrl');
require('./RotationsList.ctrl');
    
// Single Rotation Views
require('./Rotation.ctrl');
require('./new/RotationsCreate.ctrl');
require('./info/RotationInfo.ctrl');