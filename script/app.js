class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { image: null }
    }
    render() {
        return React.createElement(
            'div',
            { className: 'wrapper' },
            React.createElement(Header)
        )
    }
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