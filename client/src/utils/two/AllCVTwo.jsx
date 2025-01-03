import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaProjectDiagram, FaGraduationCap, FaBriefcase, FaUserAlt, FaGlobe } from 'react-icons/fa';

const URL = import.meta.env.VITE_LOCAL_URL;

function AllCVTwo() {
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

    const handlePayment = () => {
        const options = {
            key: 'rzp_test_zHsqW4O66eZ8Lt',
            amount: 500, // ₹5 for download
            currency: 'INR',
            name: 'Your Company Name',
            description: 'CV Download Fee',
            handler: function () {
                alert('Payment successful! Generating CV...');
                generatePDF();
            },
            prefill: {
                name: cvData?.basicDetails?.name || '',
                email: cvData?.basicDetails?.email || '',
                contact: cvData?.basicDetails?.phone || '',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const generatePDF = async () => {
        const element = document.getElementById('cv-section');
        const button = document.querySelector('.download-button');

        if (!element) return;

        if (button) button.style.display = 'none';

        const canvas = await html2canvas(element, {
            scale: 3, // Higher scale for better resolution
            useCORS: true, // Allow cross-origin images
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 10; // 5mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const x = (pageWidth - imgWidth) / 2; // Center horizontally
        const y = (pageHeight - imgHeight) / 2; // Center vertically

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`CV_${cvData?.basicDetails?.name || 'Candidate'}.pdf`);

        if (button) button.style.display = '';
    };

    if (!cvData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex justify-center items-center bg-gray-100 min-h-screen">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 flex" id="cv-section">
                {/* Left Section */}
                <div className="w-1/3 bg-gray-900 text-white rounded-l-lg p-6">
                    <div className="flex justify-center mb-4">
                        <img
                            src={cvData.basicDetails.imageUrl || '/pic2.jpg'}
                            alt={cvData.basicDetails.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                        />
                    </div>
                    <h2 className="text-center text-2xl font-bold mb-2">{cvData.basicDetails.name}</h2>
                    <p className="text-center text-gray-400 mb-6">{cvData.basicDetails.position}</p>
                    <h3 className="text-lg font-bold mb-2 flex items-center">
                        <FaUserAlt className="mr-2" /> About Me
                    </h3>
                    <p className="mb-6">{cvData.basicDetails.introductoryParagraph || 'No introductory paragraph provided.'}</p>
                    <h3 className="text-lg font-bold mb-2 flex items-center">
                        <FaPhone className="mr-2" /> Basic Details
                    </h3>
                    <p className="mb-1"><FaPhone className="inline mr-2" /> {cvData.basicDetails.phone}</p>
                    <p className="mb-1"><FaEnvelope className="inline mr-2" /> {cvData.basicDetails.email}</p>
                    <p className="mb-1"><FaMapMarkerAlt className="inline mr-2" /> {`${cvData.basicDetails.city}, ${cvData.basicDetails.state}`}</p>
                    <h3 className="text-lg font-bold mb-2 mt-6 flex items-center">
                        <FaGlobe className="mr-2" /> Social Profiles
                    </h3>
                    {cvData.socialProfiles?.map((profile, index) => (
                        <p key={index} className="mb-1">
                            <span>{profile.platformName}: </span>
                            <a href={profile.profileLink} target="_blank" rel="noopener noreferrer" className="underline">
                                {profile.profileLink}
                            </a>
                        </p>
                    ))}
                </div>

                {/* Right Section */}
                <div className="w-2/3 p-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                        <FaGraduationCap className="mr-2" /> Education
                    </h3>
                    {cvData.education?.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="font-bold">{edu.degreeName}</h4>
                            <p>{edu.institution}</p>
                            <p>Percentage: {edu.percentage}%</p>
                        </div>
                    ))}
                    <h3 className="text-2xl font-bold mb-4 flex items-center mt-6">
                        <FaBriefcase className="mr-2" /> Experience
                    </h3>
                    {cvData.experience?.length > 0 ? (
                        cvData.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <h4 className="font-bold">{exp.organizationName || 'Neosoft'}</h4>
                                <p>{exp.role || 'Software Engineer'}</p>
                                <p>CTC: {exp.ctc || '5 LPA'}</p>
                                <p>{exp.description || 'Contributed to various software development projects using modern technologies, collaborating closely with cross-functional teams to deliver high-quality solutions.'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No experience provided.</p>
                    )}

                    <div className="mt-5">
                        <h3 className="text-xl border-b border-gray-400 pb-2">Skills</h3>
                        <ul className="list-none">
                            {cvData.skills?.length > 0 ? (
                                cvData.skills.map((skill, index) => (
                                    <li key={index}>{skill.name || 'MERN'}</li>
                                ))
                            ) : (
                                <li>No skills provided.</li>
                            )}
                        </ul>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 flex items-center mt-6">
                        <FaProjectDiagram className="mr-2" /> Projects
                    </h3>
                    {cvData.projects?.length > 0 ? (
                        cvData.projects.map((project, index) => (
                            <div key={index} className="mb-4">
                                <h4 className="font-bold">{project.projectTitle || 'E-commerce Platform'}</h4>
                                <p><strong>Team Size:</strong> {project.teamSize || '5'}</p>
                                <p><strong>Duration:</strong> {project.duration || '6 months'}</p>
                                <p><strong>Technologies:</strong> {project.technologies.length > 0 ? project.technologies.join(', ') : 'No technologies specified.'}</p>
                                <p><strong>Description:</strong> {project.description || 'Developed a full-stack e-commerce application with features such as user authentication, product management, and a shopping cart.'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No projects provided.</p>
                    )}
                    <button
                        className="download-button bg-blue-600 text-white py-2 px-4 rounded-lg mt-5"
                        onClick={handlePayment}
                    >
                        Download CV (₹5)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllCVTwo;
