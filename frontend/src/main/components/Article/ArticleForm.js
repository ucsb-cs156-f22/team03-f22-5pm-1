import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function ArticleForm({ initialArticle, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialArticle || {} }
    );
    // Stryker enable all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialArticle && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Form.Control
                        data-testid="ArticleForm-title"
                        id="title"
                        type="text"
                        {...register("title")}
                        value={initialArticle.title}
                        disabled
                    />
                </Form.Group>
            )}


            {!initialArticle && (
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
                    type="text"
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
                    type="text"
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
                    type="text"
                    isInvalid={Boolean(errors.dateAdded)}
                    {...register("dateAdded", { 
                        required: "Date Added is required. QuarterYYYYQ must be in the format YYYYQ, e.g. 20224 for Fall 2022" })}
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
