import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const URL = import.meta.env.VITE_LOCAL_URL;

const AllCVOne = () => {
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

        if (id) fetchCVData();
    }, [id]);

    const handlePayment = () => {
        const options = {
            key: 'rzp_test_zHsqW4O66eZ8Lt',
            amount: 500,
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
        <div
            className="flex p-5 bg-gray-100"
            id="cv-section"
            style={{ width: '210mm', minHeight: '297mm', padding: '10mm' }}
        >
            {/* Left Side - CV Image and Details */}
            <div className="w-1/3 p-5 bg-gray-800 text-white rounded-lg mr-5">
                <div className="text-center mb-5">
                    <img
                        src={cvData.basicDetails.imageUrl}
                        alt={cvData.basicDetails.name}
                        crossOrigin="anonymous"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/pic2.jpg';
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
                                <h4 className="font-bold">{project.projectTitle || 'Project Title'}</h4>
                                <p><strong>Team Size:</strong> {project.teamSize || 'N/A'}</p>
                                <p><strong>Duration:</strong> {project.duration || 'N/A'}</p>
                                <p><strong>Technologies:</strong> {project.technologies?.join(', ') || 'N/A'}</p>
                                <p><strong>Description:</strong> {project.description || 'No description provided.'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No projects specified.</p>
                    )}
                </div>

                <button
                    className="download-button bg-blue-600 text-white py-2 px-4 rounded-lg mt-5"
                    onClick={handlePayment}
                >
                    Download CV (₹5)
                </button>
            </div>
        </div>
    );
};

export default AllCVOne;
