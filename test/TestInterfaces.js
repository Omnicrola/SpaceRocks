/**
 * Created by Eric on 12/12/2015.
 */
module.exports = {
    assert: {
        subsystems: function (obj) {
            verify(obj).implements('EngineSubsystem', [
                'update',
                'render',
                'initialize'
            ]);
        },
        state: function (obj) {
            verify(obj).implements('State',
                [
                    'load',
                    'unload',
                    'update'
                ])
        }
    }
};

function verify(obj) {
    return {
        implements: function (interfaceName, properties) {
            properties.forEach(function (propName) {
                if (typeof obj[propName] !== 'function') {
                    throw new Error('Object does not conform to the "' + interfaceName + '" interface. "' +
                        propName + '"  is either missing or not a function.');
                }
            });
        }
    }
}