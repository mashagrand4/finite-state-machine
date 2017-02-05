class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config = null)  {
        if (null === config) {
            throw new Error("Config is not set");
        }
        this.config = config;
        this.state = config.initial;
        this.historyStates = [];
        this.historyIndexState = -1;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!this.config.states.hasOwnProperty(state)){
            throw new Error("State is not exist");
        }
        this.historyStates.push(this.state);
        this.historyIndexState = this.historyStates.length - 1;
        this.state = state;
        return this;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var newState;
        for(var e in this.config.states[this.state].transitions){
          if(e == event){
            newState = this.config.states[this.state].transitions[e];
            break;
          }
        }
        if(newState){
            this.changeState(newState);
        }
        else{
            throw new Error("Event is not exist");
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = null) {
        if(event == null){
            return Object.keys(this.config.states);
        }
        else {
            var states = [];
            for(var s in this.config.states){
                if(this.config.states[s].transitions.hasOwnProperty(event)){
                    states.push(s);
                }
            }
            if(!states){
                throw new Error("State is not exist");
            }
            return states;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.historyIndexState < 0){
            return false;
        }
        this.historyStates.push(this.state);
        this.state = this.historyStates[this.historyIndexState];
        this.historyIndexState --;

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.historyStates[this.historyIndexState+2]){
            return false;
        }
        this.state = this.historyStates[this.historyIndexState+2];
        this.historyIndexState++;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyStates = [];
        this.historyIndexState = -1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
