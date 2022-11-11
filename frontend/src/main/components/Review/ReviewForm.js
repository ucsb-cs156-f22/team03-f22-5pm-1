import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function ReviewForm({ initialReview, submitAction, buttonLabel="Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialReview || {}, }
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

            {initialReview && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="ReviewForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialReview.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="itemID">itemID</Form.Label>
                <Form.Control
                    data-testid="ReviewForm-itemID"
                    id="itemID"
                    type="text"
                    isInvalid={Boolean(errors.itemID)}
                    {...register("itemID", { 
                        required: "itemID is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemID?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">reviewerEmail</Form.Label>
                <Form.Control
                    data-testid="ReviewForm-reviewerEmail"
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", { 
                        required: "reviewerEmail is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="stars">stars</Form.Label>
                <Form.Control
                    data-testid="ReviewForm-stars"
                    id="stars"
                    type="text"
                    isInvalid={Boolean(errors.stars)}
                    {...register("stars", { 
                        required: "stars is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stars?.message}
                </Form.Control.Feedback>
            </Form.Group>
            

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateReviewed">dateReviewed (iso format)</Form.Label>
                <Form.Control
                    data-testid="ReviewForm-dateReviewed"
                    id="dateReviewed"
                    type="text"
                    isInvalid={Boolean(errors.dateReviewed)}
                    {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateReviewed && 'dateReviewed is required. '}
                    {errors.dateReviewed?.type === 'pattern' && 'dateReviewed must be in ISO format, e.g. 2022-01-02T15:30'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">comments</Form.Label>
                <Form.Control
                    data-testid="ReviewForm-comments"
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("comments", {
                        required: "comments is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="ReviewForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="ReviewForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default ReviewForm;
