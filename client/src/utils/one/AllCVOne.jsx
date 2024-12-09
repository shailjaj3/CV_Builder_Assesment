import { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const URL = import.meta.env.VITE_LOCAL_URL;

function AllCVOne() {
    const { id } = useParams();
    const [cvData, setCVData] = useState(null);

    useEffect(() => {
        const fetchCVData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URL}/api/v1/cv/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCVData(response.data.data);
            } catch (error) {
                console.error('Error fetching CV data:', error);
            }
        };

        if (id) {
            fetchCVData();
        }
    }, [id]);

    // Function to generate PDF
    const generatePdf = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');

        pdf.setFontSize(22);
        pdf.text(`${cvData?.basicDetails?.name}`, 105, 20, null, null, 'center');

        const imageUrl = '/mnt/data/Modern Minimalist CV Resume (2).jpg'; // Path to the uploaded image
        const defaultImageUrl = '/pic2.jpg'; // Fallback image in the public directory

        // Attempt to add the image; if it fails, use fallback
        try {
            pdf.addImage(imageUrl, 'JPEG', 10, 30, 40, 40); 
        } catch (error) {
            console.error('Failed to load uploaded image, using fallback.');
            pdf.addImage(defaultImageUrl, 'JPEG', 10, 30, 40, 40); 
        }

        pdf.setFontSize(12);
        pdf.text('About Me:', 10, 80);
        pdf.setFontSize(10);
        pdf.text(cvData.basicDetails.introductoryParagraph || 'No introductory paragraph provided.', 10, 90, { maxWidth: 190 });

        pdf.save(`${cvData?.basicDetails?.name}-CV.pdf`);
    };

    // Razorpay payment handler
    const handlePayment = () => {
        const options = {
            key: 'rzp_test_zHsqW4O66eZ8Lt',
            amount: 500, // ₹5 in paise (500 paise = ₹5)
            currency: 'INR',
            name: 'Your Company Name',
            description: 'CV Download Fee',
            handler: function (response) {
                alert('Payment successful! Downloading CV...');
                generatePdf(); // Download PDF after successful payment
            },
            prefill: {
                name: cvData.basicDetails.name,
                email: cvData.basicDetails.email,
                contact: cvData.basicDetails.phone,
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (!cvData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex p-5 bg-gray-100" id="cv-section">
            {/* Left Side - CV Image and Details */}
            <div className="w-1/3 p-5 bg-gray-800 text-white rounded-lg mr-5">
                <div className="text-center mb-5">
                    <img
                        src="/mnt/data/Modern Minimalist CV Resume (2).jpg"  // Path to uploaded image
                        alt={cvData.basicDetails.name}
                        onError={(e) => {
                            e.target.onerror = null; // Prevents looping
                            e.target.src = "/pic2.jpg"; // Fallback to default image
                        }}
                        className="w-40 h-40 rounded-full mx-auto object-cover"
                    />
                </div>
                <h2 className="text-center text-2xl font-bold">{cvData.basicDetails.name}</h2>
                <p className="text-center text-gray-400">Product Designer</p>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">About Me</h3>
                    <p>{cvData.basicDetails.introductoryParagraph || 'No introductory paragraph provided.'}</p>
                </div>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Contact</h3>
                    <p>{`${cvData.basicDetails.phone} | ${cvData.basicDetails.email}`}</p>
                    <p>{`${cvData.basicDetails.address}, ${cvData.basicDetails.city}, ${cvData.basicDetails.state}`}</p>
                </div>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Languages</h3>
                    <ul className="list-none">
                        {cvData.languages?.map((lang, index) => (
                            <li key={index}>{lang}</li>
                        )) || 'No languages specified.'}
                    </ul>
                </div>
            </div>

            {/* Right Side - Experience, Education, Skills, Projects */}
            <div className="w-2/3 p-5 bg-white rounded-lg">
                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Experience</h3>
                    {cvData.experience?.map((exp, index) => (
                        <div key={index}>
                            <h4>{exp.organizationName}</h4>
                            <p>{exp.position} - {exp.technologies.join(', ') || 'No technologies specified.'}</p>
                        </div>
                    )) || 'No experience specified.'}
                </div>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Education</h3>
                    {cvData.education?.map((edu, index) => (
                        <div key={index}>
                            <h4>{edu.institution}</h4>
                            <p>{edu.degreeName} - {edu.percentage}%</p>
                        </div>
                    )) || 'No education specified.'}
                </div>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Skills</h3>
                    <ul className="list-none">
                        {cvData.skills?.map((skill, index) => (
                            <li key={index}>{skill.skillName}</li>
                        )) || 'No skills specified.'}
                    </ul>
                </div>

                <div className="mt-5">
                    <h3 className="text-xl border-b border-gray-400 pb-2">Projects</h3>
                    {cvData.projects?.length > 0 ? (
                        cvData.projects.map((project, index) => (
                            <div key={index} className="mb-4">
                                <h4 className="font-bold">{project.projectTitle || 'Ecommerce Platform Development '}</h4>
                                <p><strong>Team Size:</strong> {project.teamSize || '15'}</p>
                                <p><strong>Duration:</strong> {project.duration || '2.5 Year'}</p>
                                <p><strong>Technologies:</strong> {project.technologies.length > 0 ? project.technologies.join(', ') : 'No technologies specified.'}</p>
                                <p><strong>Description:</strong> {project.description || 'Developed a scalable ecommerce platform that handled over 50,000 daily users with features like multi-vendor support, real-time order tracking, payment gateway integration, and customer review management. The project also involved performance optimization using advanced caching techniques and microservices architecture.'}</p>                            </div>
                        ))
                    ) : (
                        <p>No projects specified.</p>
                    )}
                </div>

                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-5"
                    onClick={handlePayment}
                >
                    Download CV (₹5)
                </button>
            </div>
        </div>
    );
}

export default AllCVOne;
