import { useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import AddRole from "./addRole";
import store from '../store/role';

const AllRoles = observer(() => {
    const data = store.dataRoles;
    const [addRole, setAddRole] = useState(false);
    const handleAddRole = () => {
        setAddRole(true);
    };
    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRole}
                sx={{ marginTop: 2, backgroundColor: "red", marginLeft: "50vw" }}
            >
                Add Role
            </Button>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginTop: '20px' }}>
                {data.map(role => (
                    <Card key={role.id} sx={{ width: "20vw", margin: '5vw', marginBottom: 2, display: 'inline-block' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <p>{role.name}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {addRole && <AddRole closeForm={setAddRole}></AddRole>}
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button startIcon={<ArrowForwardIcon />} variant="contained"
                    sx={{ marginTop: "30px", marginBottom: "30px", marginLeft: "50vw", backgroundColor: "red" }}
                >
                    Employees
                </Button>
            </Link>
        </>
    )
})
export default AllRoles;