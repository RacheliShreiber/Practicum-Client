import axios from 'axios'
import { action, makeObservable, observable, runInAction } from "mobx";
class Role {
    dataRoles = [];

    constructor() {
        makeObservable(this, {
            dataRoles: observable,
            addRole: action,
        });
        this.getAllRoles();
    }

    async getAllRoles() {
        axios.get('https://localhost:7089/api/Roles').then(res =>
            runInAction(() => {
                this.dataRoles = res.data;
            })
        )
    }

    async addRole(role) {
        const roleToAdd = {
            name: role.name
        }
        fetch('https://localhost:7089/api/Roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleToAdd)
        }).then((res) => {
            res.json().then(data => {
                runInAction(() => {
                    this.dataRoles = [...this.dataRoles, data];
                });
            });
        })
    }
}
export default new Role();