const { getModuleByDisplayName, React } = require('powercord/webpack');
const { Button, AsyncComponent } = require('powercord/components');
const Input = AsyncComponent.from(getModuleByDisplayName('TextInput'));
const { SwitchItem } = require('powercord/components/settings')

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredWords: props.getSetting('filteredWords', [])
        };
    }

    render() {
        return (
            <div>
                <div style={{ paddingBottom: 10 }} id='filtered-words'>
                    {this.generateInputs()}
                </div>
                <Button
                    disabled={!this.state.changes}
                    onClick={() => {
                        this._set('filteredWords', this.state.filteredWords);
                        this.state.changes = false;
                    }}
                >
                    Save
                </Button>
                <SwitchItem
                    value={this.props.getSetting('blur', false)}
                    onChange={() => {
                        this.props.toggleSetting('blur')
                    }}
                    note='Whether to blur a message that contians a filtered word rather than deleting it.'
                >
                    Blur Filtered Message
                </SwitchItem>
            </div>
        );
    }

    _set(key, value = !this.state[key], defaultValue) {
        if (!value && defaultValue) {
            value = defaultValue;
        }

        this.props.updateSetting(key, value);
        this.setState({ [key]: value });
    }


    generateInputs() {
        const is = [...this.state.filteredWords];
        if (is.length === 0) {
            is.push({
                key: 0,
                value: ''
            });
        }

        const dis = is.map((n, i) => (
            <Input
                key={n.key}
                defaultValue={n.value}
                onBlur={e => {
                    const a = is;

                    if (e.target.value === '') {
                        a.splice(i, 1);
                        if (a.length === 0) {
                            return;
                        }
                    } else {
                        a[i].value = e.target.value;
                    }

                    if (a[a.length - 1].value !== '') {
                        a.push({
                            key: a[a.length - 1].key + 1,
                            value: ''
                        });
                    }

                    this.setState({ filteredWords: a });
                    this.state.changes = true;
                }}
                placeholder='Input Word...'
                style={{ margin: '1%' }}
            />
        ));

        return <div>{dis}</div>;
    }
};