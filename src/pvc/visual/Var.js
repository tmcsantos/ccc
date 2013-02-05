
/**
 * Initializes a scene variable.
 * 
 * @name pvc.visual.ValueLabelVar
 * @class A scene variable holds the concrete value that 
 * a {@link pvc.visual.Role} or other relevant piece of information 
 * has in a {@link pvc.visual.Scene}.
 * Usually, it also contains a label that describes it.
 * 
 * @constructor
 * @param {any} value The value of the variable.
 * @param {any} label The label of the variable.
 * @param {any} [rawValue] The raw value of the variable.
 */
pvc.visual.ValueLabelVar = function(value, label, rawValue){
    this.value = value;
    this.label = label;
    
    if(rawValue !== undefined){
        this.rawValue = rawValue;
    }
};

def.set(
    pvc.visual.ValueLabelVar.prototype, 
    'rawValue', undefined,
    'clone',    function(){
        return new pvc.visual.ValueLabelVar(this.value, this.label, this.rawValue);
    },
    'toString', function(){
        var label = this.label || this.value;
        return typeof label !== 'string' ? ('' + label) : label;
    });


def
.type('pvc.visual.ColorVarHelper')
.init(function(chart, colorRole){
    this.colorGrouping = colorRole.grouping;
    
    var colorFirstDimName = this.colorGrouping.firstDimensionName();
    
    this.rootColorDim = chart.data.owner.dimensions(colorFirstDimName);
    
    this.isDiscrete = this.colorGrouping.isDiscrete();
    
    this.colorSourceRoleName = colorRole.sourceRole && colorRole.sourceRole.name;
})
.add({
    onNewScene: function(scene, isLeaf){
        if(scene.vars.color){
            return;
        }
        
        var sourceName = this.colorSourceRoleName;
        if(sourceName){
            var colorSourceVar = def.getOwn(scene.vars, sourceName);
            if(colorSourceVar){
                scene.vars.color = colorSourceVar.clone();
                return;
            }
        }

        if(isLeaf){
            // Not grouped, so there's no guarantee that
            // there's a single color value for all the datums of the group.
        
            var colorVar;
            if(this.isDiscrete){
                // We choose the color of the first datum of the group...
                var firstDatum = scene.datum;
                if(firstDatum && !firstDatum.isNull){
                    var view = this.colorGrouping.view(firstDatum);
                    colorVar = new pvc.visual.ValueLabelVar(
                        view.value,
                        view.label,
                        view.rawValue);
                }
            } else {
                var group = scene.group;
                var singleDatum = group ? group.singleDatum() : scene.datum;
                if(singleDatum){
                    if(!singleDatum.isNull){
                        colorVar = Object.create(singleDatum.atoms[this.rootColorDim.name]);
                    }
                } else if(group){
                    var value = group
                                .dimensions(this.rootColorDim.name)
                                .sum({visible: true, zeroIfNone: false});
                    
                    var label = this.rootColorDim.format(value);
                    
                    colorVar = new pvc.visual.ValueLabelVar(value, label, value);
                }
            }

            scene.vars.color = colorVar || new pvc.visual.ValueLabelVar(null, "");
        }
    }
});
