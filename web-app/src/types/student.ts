export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    dob: Date;
    gender: string;
    address_line1: string;
    address_line2: string;
    city: string;
    contact_number: string;
    contact_number_guardian: string;
    supervisor_id: number;
    employer_id: number;
    remarks: string;
    photo: Uint8Array;
    home_long: string;
    home_lat: string;
}