import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function MenuItemForm({ initialMenuItem, submitAction, buttonLabel="Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialMenuItem || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialMenuItem && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="MenuItemForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialMenuItem.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="diningCommonsCode">DiningCommonsCode</Form.Label>
                <Form.Control
                    data-testid="MenuItemForm-diningCommonsCode"
                    id="diningCommonsCode"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("diningCommonsCode", {
                        required: "DiningCommonsCode is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.diningCommonsCode?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid="MenuItemForm-name"
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="station">Station</Form.Label>
                <Form.Control
                    data-testid="MenuItemForm-station"
                    id="station"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("station", {
                        required: "Station is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.station?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="MenuItemForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="MenuItemForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MenuItemForm;
