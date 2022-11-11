import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function RecommendationForm({ initialRecommendation, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialRecommendation || {} }
    );
    // Stryker enable all

    const navigate = useNavigate();
    
    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;


    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialRecommendation && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="RecommendationForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialRecommendation.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                <Form.Control
                    data-testid="RecommendationForm-requesterEmail"
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", {
                        required: "Requester email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
                <Form.Control
                    data-testid="RecommendationForm-professorEmail"
                    id="professorEmail"
                    type="text"
                    isInvalid={Boolean(errors.professorEmail)}
                    {...register("professorEmail", {
                        required: "Professor email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.professorEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid="RecommendationForm-explanation"
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "Explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateRequested">Date requested (iso format)</Form.Label>
                <Form.Control
                    data-testid="RecommendationForm-dateRequested"
                    id="dateRequested"
                    type="text"
                    isInvalid={Boolean(errors.dateRequested)}
                    {...register("dateRequested", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateRequested && 'Date requested is required. '}
                    {errors.dateRequested?.type === 'pattern' && 'Date requested must be in ISO format, e.g. 2022-01-02T15:30'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateNeeded">Date needed (iso format)</Form.Label>
                <Form.Control
                    data-testid="RecommendationForm-dateNeeded"
                    id="dateNeeded"
                    type="text"
                    isInvalid={Boolean(errors.dateNeeded)}
                    {...register("dateNeeded", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateNeeded && 'dateNeeded is required. '}
                    {errors.dateNeeded?.type === 'pattern' && 'dateNeeded must be in ISO format, e.g. 2022-01-02T15:30'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="done">Done?</Form.Label>
                <Form.Check
                    data-testid="RecommendationForm-done"
                    type="checkbox"
                    id="done"
                    {...register("done")}
                />
            </Form.Group>

            <Button
                type="submit"
                data-testid="RecommendationForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="RecommendationForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RecommendationForm;
