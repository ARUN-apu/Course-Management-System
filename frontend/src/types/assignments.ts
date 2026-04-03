export interface Assignment {
    id: number;
    course_id: number;
    instructor_id: number;
    title: string;
    description: string;
    due_date: string;
    is_complete: number;
}