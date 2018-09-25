import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HostRepository, GuestRepository } from './lib';


interface State {
    notice: string
    error: string
    host: {
        encryptedUserId: string,
        locationId: string,
        locationName: string,
        userName: string,
    },
    guest: {
        firstName: string,
        lastName: string,
        email: string,
        dateOfVisit: string,
    },
    isValidGuest: boolean,
};

interface StoredHost {
    euuid: string;
    locationId: string;
    locationName: string;
    userName: string;
}

class Index extends React.Component<{}, State>{
    private hostRepository: HostRepository;
    private guestRepository: GuestRepository;

    constructor(props: any) {
        super(props);

        this.state = {
            notice: "",
            error: "",
            host: {
                encryptedUserId: "",
                locationId: "",
                locationName: "",
                userName: "",
            },
            guest: {
                firstName: "",
                lastName: "",
                email: "",
                dateOfVisit: ""
            },
            isValidGuest: false,
        };

        //TODO injection
        this.hostRepository = new HostRepository();
        this.guestRepository = new GuestRepository();


        //https://qiita.com/konojunya/items/fc0cfa6a56821e709065
        this.handleChange = this.handleChange.bind(this);
        this.registerGuest = this.registerGuest.bind(this);
    }
    componentDidMount() {
        this.hostRepository.get().then((host: StoredHost) => {
            this.setState({
                host: {
                    encryptedUserId: host.euuid,
                    locationId: host.locationId,
                    locationName: host.locationName,
                    userName: host.userName
                }
            })
        }).catch(() => {
            this.setState({
                error: 'Please login at https://members.wework.com'
            });
        });
    }

    registerGuest() {
        console.log(this.state.guest);
    }
    handleChange(e: any) {
        let guest = this.state.guest;

        switch (e.target.name) {
            case "firstName":
                guest.firstName = e.target.value;
                break;
            case "lastName":
                guest.lastName = e.target.value;
                break;
            case "email":
                guest.email = e.target.value;
                break;
            case "dateOfVisit":
                guest.dateOfVisit = e.target.value;
                break;
        }

        this.setState({
            guest: guest,
            isValidGuest: this.isValidGuest(guest)
        });
    }

    isValidGuest(g: any): boolean {
        return g.firstName && g.lastName && g.email && g.dateOfVisit;
    }

    render() {
        const message = (this.state.notice !== "") ? <p className="alert alert-success">{this.state.notice}</p> : <div />;
        const error = (this.state.error !== "") ? <p className="alert alert-danger">{this.state.error}</p> : <div />;
        const hello = (this.state.host.userName !== "") ?
            <p>{'Hi, ' + this.state.host.userName + '@' + this.state.host.locationName}</p>
            : <div />;

        return (
            <div className="container-fluid">
                <h3>Quick Guest Invitation</h3>
                {message}
                {error}
                {hello}

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">FirstName</label>
                    <div className="col-sm-10">
                        <input type="text" name="firstName" onChange={this.handleChange} value={this.state.guest.firstName} className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">LastName</label>
                    <div className="col-sm-10">
                        <input type="text" name="lastName" onChange={this.handleChange} value={this.state.guest.lastName} className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">email</label>
                    <div className="col-sm-10">
                        <input type="text" name="email" onChange={this.handleChange} value={this.state.guest.email} className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">ArrivalTime</label>
                    <div className="col-sm-10">
                        <input type="text" name="dateOfVisit" onChange={this.handleChange} value={this.state.guest.dateOfVisit} className="form-control" />
                    </div>
                </div>

                <br />
                <button type="button" disabled={!this.state.isValidGuest} onClick={this.registerGuest} className="btn btn-lg btn-danger">Sent Invitation</button>
                <a href="https://form.run/@feedback">　feedback?</a>
            </div>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('js-application-mountpoint')
);