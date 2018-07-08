class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { image: null }
    }
    render() {
        return React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(Header),
            React.createElement(Footer)
        )
    }
}

function Footer(props) {
    return React.createElement(
        'div',
        { className: 'footing' },
        'A GNT creation \u00A92018'
    )
}

function Header(props) {
    return React.createElement(
        'h1',
        { className: 'heading' },
        'Welcome to Tag Topple!'
    )
}

var container = document.querySelector('#appspace');
ReactDOM.render(
    React.createElement(Wrapper), 
    container
);