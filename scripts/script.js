const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Instructions = require('Instruction');
const sceneRoot = Scene.root;

const Patches = require('Patches');

Promise.all([
    sceneRoot.findFirst('lights'),
    sceneRoot.findFirst('planeTracker0')
])
    .then(function (objects) {
        const lights = objects[0];
        const planeTracker = objects[1];
        const lightsTransform = lights.transform;
        var cond = Reactive.val(true);
        
        
        TouchGestures.onPan().subscribe(function (gesture) {
            Instructions.bind(cond, 'pinch_to_zoom');
            planeTracker.trackPoint(gesture.location, gesture.state);
        })

        TouchGestures.onPinch().subscribeWithSnapshot({
            'lastScaleX': lightsTransform.scaleX,
            'lastScaleY': lightsTransform.scaleY,
            'lastScaleZ': lightsTransform.scaleZ
        }, function (gesture, snapshot) {
            Instructions.bind(false, 'pinch_to_zoom');
            lightsTransform.scaleX = gesture.scale.mul(snapshot.lastScaleX);
            lightsTransform.scaleY = gesture.scale.mul(snapshot.lastScaleY);
            lightsTransform.scaleZ = gesture.scale.mul(snapshot.lastScaleZ);
        })

    });

