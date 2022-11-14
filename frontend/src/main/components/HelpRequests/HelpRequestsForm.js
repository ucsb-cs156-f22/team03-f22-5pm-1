import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function HelpRequestsForm({ initialHelpRequests, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialHelpRequests || {} }
    );
    // Stryker enable all

    const navigate = useNavigate();
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialHelpRequests && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="HelpRequestsForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialHelpRequests.id}
                        disabled
                    />
                </Form.Group>
            )}


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">Email</Form.Label>
                <Form.Control
                    data-testid="HelpRequestsForm-requesterEmail"
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", 
                    { required: "requesterEmail is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>   

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="teamId">teamid</Form.Label>
                <Form.Control
                    data-testid="HelpRequestsForm-teamId"
                    id="teamId"
                    type="text"
                    isInvalid={Boolean(errors.teamId)}
                    {...register("teamId", {
                        required: "teamId is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.teamId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">table/breakoutroom</Form.Label>
                <Form.Control
                    data-testid="HelpRequestsForm-tableOrBreakoutRoom"
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", {
                        required: "tableOrBreakoutRoom is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid="HelpRequestsForm-explanation"
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="solved">solve or not</Form.Label>
                <Form.Check
                    data-testid="HelpRequestsForm-solved"
                    type="checkbox"
                    id="solved"
                    {...register("solved")}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requestTime">date (iso format)</Form.Label>
                <Form.Control
                    data-testid="HelpRequestsForm-requestTime"
                    id="requestTime"
                    type="text"
                    isInvalid={Boolean(errors.requestTime)}
                    {...register("requestTime", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime && 'requestTime is required.'}
                    {errors.requestTime?.type === 'pattern' && 'requestTime must be in ISO format, e.g. 2022-01-02T15:30'}
                </Form.Control.Feedback>
            </Form.Group>




            <Button
                type="submit"
                data-testid="HelpRequestsForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="HelpRequestsForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default HelpRequestsForm;
