import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { observer } from "mobx-react";
import { TextField, Box, Select, InputLabel, FormControl, Button, Checkbox, } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Alert from '@mui/material/Alert';
import storeRole from '../store/role';
import store from '../store/employee';

const AddOrUpdateEmployee = observer(({ flagCloseForm, EmployeeId }) => {
    const dataRole = storeRole.dataRoles;
    const isExists = store.dataEmployees.find(e => e.id === EmployeeId);
    const [isEmpRolesEmpty, setIsEmpRolesEmpty] = useState(false);
    const [isSameRoleId, setIsSameRoleId] = useState(false);
    const { register, handleSubmit, formState: { errors }, control, setValue, getValues } = useForm(
        {
            defaultValues: { employeeRoles: [{ roleId: '', isDirector: false, startRole: '' }] },
        }
    );
    const { fields, append, remove } = useFieldArray({
        control,
        name: "employeeRoles"
    });
    useEffect(() => {
        setValue('firstName', isExists?.firstName || '');
        setValue('lastName', isExists?.lastName || '');
        setValue('identity', isExists?.identity || '');
        setValue('startWork', isExists?.startWork ? new Date(isExists.startWork).toISOString().split('T')[0] : '');
        setValue('birthDate', isExists?.birthDate ? new Date(isExists.birthDate).toISOString().split('T')[0] : '');
        setValue('type', isExists?.type || '');
        setValue('employeeRoles', isExists?.employeeRoles || [{ roleId: '', isDirector: false, startRole: '' }]);
    }, [isExists, setValue]);

    function isIsraeliIdNumber(id) {
        id = String(id).trim();
        if (id.length !== 9 || isNaN(id)) return false;
        id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
        return Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }) % 10 === 0;
    }
    function addOrUpdateEmployeeToStore(emp) {
        if (emp.employeeRoles.length === 0) {
            setIsEmpRolesEmpty(true);
            return
        }
        const roleIds = emp.employeeRoles.map(role => role.roleId);
        const uniqueRoleIds = [...new Set(roleIds)];
        if (roleIds.length !== uniqueRoleIds.length) {
            setIsSameRoleId(true);
            return;
        }
        if (isExists) {
            emp.id = EmployeeId;
            store.updateEmployee(EmployeeId, emp);
        }
        else
            store.addEmployee(emp);
        flagCloseForm(false);
    }
    return (
        <>
            <Dialog open={true} onClose={() => flagCloseForm(false)}>
                <DialogTitle>{isExists ? "Update Employee" : "Add Employee"}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(addOrUpdateEmployeeToStore)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, '& .MuiTextField-root': { width: '50ch' }, }}>
                            <TextField
                                label="First Name"
                                {...register("firstName", { required: true })}
                                error={!!errors.firstName}
                                helperText={errors.firstName && "This field is required"}
                            />
                            <TextField
                                label="Last Name"
                                {...register("lastName", { required: true })}
                                error={!!errors.lastName}
                                helperText={errors.lastName && "This field is required"}
                            />
                            <TextField
                                label="Identity"
                                {...register("identity", {
                                    required: true, validate: (value) => {
                                        return isIsraeliIdNumber(value) || "identity is not valid"
                                    }
                                })}
                                error={!!errors.identity}
                                helperText={errors.identity && errors.identity.message}
                            />
                            <TextField
                                label="Start Work"
                                type="date"
                                {...register("startWork", { required: true })}
                                error={!!errors.startWork}
                                helperText={errors.startWork && "This field is required"}
                            />
                            <TextField
                                label="Birth Date"
                                type="date"
                                {...register("birthDate", { required: true,
                                validate: (value) => {
                                    const birthDate = new Date(value);
                                    const currentDate = new Date();
                                    return birthDate < currentDate|| "BirthDate must be before this date";;
                                }
                            })}
                                error={!!errors.birthDate}
                                helperText={errors.birthDate && errors.birthDate.message}
                            />
                            <RadioGroup
                                aria-label="type"
                                name="type"
                                defaultValue={isExists ? isExists.type : ''}
                            >
                                <FormControlLabel value="0" {...register("type", { required: true })} control={<Radio />} label="Male" />
                                <FormControlLabel value="1" {...register("type", { required: true })} control={<Radio />} label="Female" />
                            </RadioGroup>
                            {errors.type && <span>This field is required</span>}
                            {fields.map((field, index) => (
                                <Box key={field.id} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <InputLabel>Roles</InputLabel>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Role Name</InputLabel>
                                        <Select  {...register(`employeeRoles[${index}].roleId`, { required: true })}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            defaultValue={isExists?.employeeRoles[index]?.roleId || ""}
                                        >
                                            {dataRole.map(role => (
                                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors[`employeeRoles[${index}].roleId`] && <span>This field is required</span>}
                                    </FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...register(`employeeRoles[${index}].isDirector`)}
                                                defaultChecked={field?.isDirector}
                                            />
                                        }
                                        label="Is Director"
                                    />
                                    <TextField
                                        label="Start Role"
                                        type="date-local"
                                        defaultValue={isExists?.employeeRoles[index]?.startRole ? new Date(isExists.employeeRoles[index].startRole).toISOString().split('T')[0] : ""}
                                        {...register(`employeeRoles[${index}].startRole`, {
                                            required: true,
                                            validate: (value) => {
                                                const startWorkDate = new Date(getValues("startWork"));
                                                const startRoleDate = new Date(value);
                                                return startRoleDate >= startWorkDate || "Start Role date must be later than or equal to Start Work date";
                                            }
                                        })}
                                        error={!!errors[`employeeRoles[${index}].startRole`]}
                                        helperText={errors[`employeeRoles[${index}].startRole`] && errors[`employeeRoles[${index}].startRole`].message}
                                    />
                                    <Button type="button" onClick={() => remove(index)}>Remove Role</Button>
                                </Box>
                            ))}
                            {isEmpRolesEmpty && <Alert severity="error">At least one position must be filled</Alert>}
                            {isSameRoleId && <Alert severity="error">It is not possible to select a position twice for the same employee</Alert>}
                            <Button type="button" onClick={() => append({})}>Add Role</Button>
                            <Button type="submit">Submit</Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
})
export default AddOrUpdateEmployee;
