import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function OrganizationForm({ initialOrg, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialOrg || {} }
    );
    // Stryker enable all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialOrg && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="code">Org Code</Form.Label>
                    <Form.Control
                        data-testid="OrganizationForm-orgCode"
                        id="orgCode"
                        type="text"
                        {...register("orgCode")}
                        value={initialOrg.orgCode}
                        disabled
                    />
                </Form.Group>
            )}


            {!initialOrg && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="code">Org Code</Form.Label>
                    <Form.Control
                        data-testid="OrganizationForm-orgCode"
                        id="orgCode"
                        type="text"
                        isInvalid={Boolean(errors.orgCode)}
                        {...register("orgCode", {
                            required: "Org Code is required."
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.code?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Org Translation Short</Form.Label>
                <Form.Control
                    data-testid="OrganizationForm-orgTranslationShort"
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    {...register("orgTranslationShort", {
                        required: "Org Translation Short is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Org Translation</Form.Label>
                <Form.Control
                    data-testid="OrganizationForm-orgTranslation"
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslation)}
                    {...register("orgTranslation", {
                        required: "Org Translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive?</Form.Label>
                <Form.Check
                    data-testid="OrganizationForm-inactive"
                    type="checkbox"
                    id="inactive"
                    {...register("inactive")}
                />
            </Form.Group>


            <Button
                type="submit"
                data-testid="OrganizationForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="OrganizationForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default OrganizationForm;
