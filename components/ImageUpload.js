import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { API_URL } from '../config';
import styles from '@/styles/Form.module.scss';

export default function ImageUpload({ evtId, imageUploaded, token }) {
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {};
        data['ref'] = 'events';
        data['refId'] = evtId;
        data['field'] = 'image';
        const formData = new FormData();
        formData.append('files.image', image, image.name);
        formData.append('data', JSON.stringify(data));

        const res = await fetch(`${API_URL}/api/events/${evtId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        if (res.ok) {
            imageUploaded();
        } else if (res.status === 403 || res.status === 401) {
            toast.error('Not authorized');
        } else {
            toast.error('Something went wrong');
        }
    };

    const handleFileChange = (e) => {
        // console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    };

    return <div className={styles.form}>
        <h1>Upload Event Image</h1>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
            <div className={styles.file}>
                <input type="file" onChange={handleFileChange} />
            </div>
            <input type="submit" value="Upload" className="btn" />
        </form>
    </div>
}
