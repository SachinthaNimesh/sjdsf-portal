export interface Attendance {
    id: number;
    student_id: number;
    check_in_date_time: Date;
    check_out_date_time: Date;
    check_in_long: string;
    check_in_lat: string;
    check_out_long: string;
    check_out_lat: string;
}