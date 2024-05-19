import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import { TextField, Box, Button } from '@mui/material';
import store from '../store/role'

const AddRole = observer(({ closeForm }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    function addRoleToStore(role) {
        store.addRole(role);
        closeForm(false);
    }
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    '& .MuiTextField-root': { width: '50ch' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <form onSubmit={handleSubmit(addRoleToStore)}>
                    <TextField
                        label="Name of Role"
                        {...register("name", { required: true })}
                        error={!!errors.name}
                        helperText={errors.name && "This field is required"}
                    />
                    <Box mt={2}>
                        <Button type="submit" sx={{ backgroundColor: "red", color: "white" }}>Submit</Button>
                    </Box>
                </form>
            </Box>
        </>
    )
})
export default AddRole;