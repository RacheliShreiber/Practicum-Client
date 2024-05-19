import axios from 'axios'
import { action, makeObservable, observable, runInAction } from "mobx";

class Employee {

    dataEmployees = [];

    constructor() {
        makeObservable(this, {
            dataEmployees: observable,
            addEmployee: action,
            updateEmployee: action,
            deleteEmployee: action
        });
        this.getAllEmployees();
    }

    async getAllEmployees() {
        axios.get('https://localhost:7089/api/Employees').then(res =>
            runInAction(() => {
                this.dataEmployees = res.data
            })
        )
    }

    async addEmployee(employee) {
        const employeeToAdd = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            identity: employee.identity,
            startWork: employee.startWork,
            birthDate: employee.birthDate,
            type: parseInt(employee.type),
            employeeRoles: employee.employeeRoles.map(role => ({
                roleId: role.roleId,
                isDirector: role.isDirector,
                startRole: role.startRole
            }))
        };
        fetch('https://localhost:7089/api/Employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeToAdd)
        }).then((res) => {
            console.log("res" + res);
            if (res.status === 200) {
                res.json().then(data => {
                    runInAction(() => {
                        this.dataEmployees = [...this.dataEmployees, data];
                    });
                });
            }
        })
    }

    async updateEmployee(id, employee) {
        console.log(employee)
        const employeeToUpdate = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            identity: employee.identity,
            startWork: employee.startWork,
            birthDate: employee.birthDate,
            type: parseInt(employee.type),
            employeeRoles: employee.employeeRoles.map(role => ({
                roleId: role.roleId,
                isDirector: role.isDirector,
                startRole: role.startRole
            }))
        }

        console.log(employeeToUpdate)
        fetch(`https://localhost:7089/api/Employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeToUpdate)
        }).then((res) => {
            if (res.status === 200) {
                runInAction(() => {
                    const updatedEmployee = this.dataEmployees.findIndex(emp => emp.id === id);
                    if (updatedEmployee !== -1) {
                        this.dataEmployees[updatedEmployee] = { ...this.dataEmployees[updatedEmployee], ...employeeToUpdate };
                        this.dataEmployees = [...this.dataEmployees];
                    }
                })
            }
        });
    }

    async deleteEmployee(id) {
        fetch(`https://localhost:7089/api/Employees/${id}`, {
            method: 'DELETE'
        }).then((res) => {
            if (res.status === 200) {
                runInAction(() => {
                    this.dataEmployees = this.dataEmployees.filter(e => e.id !== id);
                });
            }
        });
    }
}
export default new Employee();