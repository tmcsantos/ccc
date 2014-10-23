var cgf_Element = cgf.Element = def.Object.extend({
    /**
     * Creates an Element instance,
     * given its scene,
     * parent element and
     * child index.
     *
     * @constructor
     * @param {cgf.Element} [parent=null] The parent element of this element.
     * @param {object} [scene=null] The scene of this element.
     * @param {number} [index=-1] The index of the scene specified in argument <i>scene</i>.
     * @alias Element
     * @memberOf cgf
     *
     * @abstract
     */
    init: function(parent, scene, index) {
        /**
         * Gets the scene that contains source data for this element.
         *
         * May be <tt>null</tt>.
         *
         * @memberOf cgf.Element
         * @type object
         */
        this.scene = scene  || null;

        /**
         * Gets the element's parent element, or <tt>null</tt> if none.
         * @memberOf cgf.Element
         * @type cgf.Element
         */
        this.parent = parent || null;

        /**
         * Gets the element's 0-based <i><scene</i> index,
         * or <tt>-1</tt> if it has no specified index.
         *
         * @memberOf cgf.Element
         * @type cgf.Element
         */
        this.index = index == null ? -1 : index;

        // Dictionary of property value by property unique name
        this._props = this._createProperties();
    },

    methods: /** @lends cgf.Element# */{
        /**
         * Called to create this instance's property values dictionary.
         *
         * Note that this function is called from within
         * the {@link cgf.Element}'s constructor.
         *
         * You can count on the fields
         * {@link cgf.Element#scene},
         * {@link cgf.Element#parent} and
         * {@link cgf.Element#index}
         * to be initialized.
         *
         * A sub-class of {@link cgf.Element} can use this method to
         * create a dictionary object that has another one as a prototype.
         *
         * The default implementation returns a plain empty object.
         *
         * @return {Object.<string, any>} The created property values dictionary.
         * @protected
         * @virtual
         */
        _createProperties: function() {
            return {};
        },

        /**
         * Gets the value of the specified property.
         *
         * @param {cgf.property} prop The property.
         * @return {any} The value of the property in this element, or <tt>undefined</tt>,
         * if not present.
         */
        get: function(prop) {
            return this._props[prop.uniqueName];
        },

        /**
         * Sets the value of the specified property to the specified value.
         *
         * This operation is not supported if the specified property
         * is calculated in this element.
         *
         * @param {cgf.property} prop The property.
         * @param {any} value The new value.
         * An <tt>undefined</tt> value is ignored.
         * A <tt>null</tt> value resets the property value.
         *
         * @return {cgf.Element} This instance.
         */
        set: function(prop, value) {
            // TODO: should prop.cast be being respected, even if not calculated?
            if(value !== undefined) {
                this._props[prop.uniqueName] = value === null ? undefined : value;
            }
            return this;
        },

        /**
         * Delegates the evaluation of a property to the base evaluator method.
         * Can optionally be given a default value,
         * that is returned instead of an undefined base result.
         *
         * This method calls the OOP-style <tt>base</tt> method, with no arguments.
         * It is designed to be used from within property evaluation functions
         * and provide backward compatibility with old CCC/protovis code.
         *
         * @param {any} [dv] The value to return when the base implementation
         * returns the value <tt>undefined</tt>.
         *
         * @return {any} The value returned by base, or,
         * when <tt>undefined</tt>, the value of the argument <i>dv</i>.
         */
        delegate: function(dv) {
            var v = this.base();
            return v === undefined ? dv : v;
        },

        /**
         * Gets this element's child index, or <tt>-1</tt>, if it has no parent.
         * @return {number} The child index or <tt>-1</tt>.
         * @abstract
         */
        get childIndex() { throw def.error.notImplemented(); }
    }
});