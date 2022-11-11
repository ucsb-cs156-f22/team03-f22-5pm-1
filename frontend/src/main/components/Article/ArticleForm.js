import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function DiningCommonsForm({ initialCommons, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialCommons || {} }
    );
    // Stryker enable all

    const navigate = useNavigate();

    const minLat = -90.0;
    const maxLat = 90.0;
    const minLong = -180.0;
    const maxLong = 180.0;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialCommons && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                        data-testid="ArticleForm-title"
                        id="title"
                        type="text"
                        {...register("title")}
                        value={initialCommons.title}
                        disabled
                    />
                </Form.Group>
            )}


            {!initialCommons && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                        data-testid="ArticleForm-title"
                        id="title"
                        type="text"
                        isInvalid={Boolean(errors.title)}
                        {...register("title", {
                            required: "Title is required."
                        })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="url">URL</Form.Label>
                <Form.Control
                    data-testid="ArticleForm-url"
                    id="url"
                    type="text"
                    isInvalid={Boolean(errors.url)}
                    {...register("url", {
                        required: "URL is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.url?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Latitude</Form.Label>
                <Form.Control
                    data-testid="ArticleForm-explanation"
                    id="explanation"
                    type="number"
                    precision={6}   
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", { 
                        required: "Explanation is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Longitude</Form.Label>
                <Form.Control
                    data-testid="ArticleForm-email"
                    id="email"
                    type="number"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", { 
                        required: "Email is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateAdded">Date Added</Form.Label>
                <Form.Control
                    data-testid="ArticleForm-dateAdded"
                    id="dateAdded"
                    type="number"
                    isInvalid={Boolean(errors.email)}
                    {...register("dateAdded", { 
                        required: "Date Added is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="ArticleForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="ArticleForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default ArticleForm;
