import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [currentSection, setCurrentSection] = useState('basicDetails');
  const [formValues, setFormValues] = useState({
    layout: 'creative',
    basicDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      introductoryParagraph: '',
      imageUrl: '',
    },
    education: [{ degreeName: '', institution: '', percentage: '' }],
    experience: [{ organizationName: '', position: '', CTC: '', technologies: '' }],
    projects: [{ projectTitle: '', teamSize: '', duration: '', description: '' }],
    skills: [{ skillName: '', perfection: '' }],
    socialProfiles: [{ platformName: '', profileLink: '' }],
  });

  const [selectedFile, setSelectedFile] = useState(null); // State for the uploaded file
  const [filePreview, setFilePreview] = useState(null); // State for the file preview

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      if (file.type.startsWith('image/')) {
        // Display image preview
        const imageUrl = URL.createObjectURL(file);
        setFilePreview(<img src={imageUrl} alt="Preview" className="rounded-full w-16 h-16 object-cover" />);
      } else if (file.type === 'application/pdf') {
        // Display PDF name as preview
        setFilePreview(<span className="text-sm text-gray-600">{file.name}</span>);
      } else {
        setFilePreview(<span className="text-sm text-red-600">Unsupported file type</span>);
      }
    }
  };

  const handleInputChange = (e, section, index, field) => {
    const { name, value } = e.target;
    const updatedFormValues = { ...formValues };

    if (index !== undefined) {
      updatedFormValues[section][index][field] = value;
    } else {
      updatedFormValues[section][name] = value;
    }
    setFormValues(updatedFormValues);
  };

  const handleAddField = (section) => {
    const updatedFormValues = { ...formValues };
    if (section === 'education') {
      updatedFormValues.education.push({ degreeName: '', institution: '', percentage: '' });
    } else if (section === 'experience') {
      updatedFormValues.experience.push({ organizationName: '', position: '', CTC: '', technologies: '' });
    } else if (section === 'projects') {
      updatedFormValues.projects.push({ projectTitle: '', teamSize: '', duration: '', description: '' });
    } else if (section === 'skills') {
      updatedFormValues.skills.push({ skillName: '', perfection: '' });
    } else if (section === 'socialProfiles') {
      updatedFormValues.socialProfiles.push({ platformName: '', profileLink: '' });
    }
    setFormValues(updatedFormValues);
  };

  const handleSectionSubmit = (e) => {
    e.preventDefault();
    const sectionOrder = [
      'basicDetails',
      'education',
      'experience',
      'projects',
      'skills',
      'socialProfiles',
    ];
    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex < sectionOrder.length - 1) {
      setCurrentSection(sectionOrder[currentIndex + 1]);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/api/v1/cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();

      if (result.success) {
        alert('CV submitted successfully');
        navigate('/all-cvs'); // Navigate to /allcv page after successful submission
      } else {
        alert('Error submitting CV');
      }
    } catch (error) {
      console.error('Error submitting CV:', error);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'basicDetails':
        return (
          <>
            <h3 className="text-lg font-semibold">Basic Details</h3>
            {Object.keys(formValues.basicDetails).map((key) => (
              <div key={key} className="flex items-center mb-4">
                <label className="flex-1 text-gray-700 pr-4 w-1/4">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  className="flex-2 border border-gray-400 rounded-lg p-2 w-3/4"
                  type={key === 'email' ? 'email' : 'text'}
                  name={key}
                  placeholder={`Enter your ${key}`}
                  value={formValues.basicDetails[key]}
                  onChange={(e) => handleInputChange(e, 'basicDetails')}
                  required={key !== 'address' && key !== 'city' && key !== 'state' && key !== 'postalCode'}
                />
              </div>
            ))}
          </>
        );
      case 'education':
        return (
          <>
            <h3 className="text-lg font-semibold">Education</h3>
            {formValues.education.map((edu, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  placeholder="Degree Name"
                  value={edu.degreeName}
                  onChange={(e) => handleInputChange(e, 'education', index, 'degreeName')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleInputChange(e, 'education', index, 'institution')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Percentage"
                  value={edu.percentage}
                  onChange={(e) => handleInputChange(e, 'education', index, 'percentage')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('education')}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Add Education
            </button>
          </>
        );
      case 'experience':
        return (
          <>
            <h3 className="text-lg font-semibold">Experience</h3>
            {formValues.experience.map((exp, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={exp.organizationName}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'organizationName')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'position')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="CTC"
                  value={exp.CTC}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'CTC')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Technologies"
                  value={exp.technologies}
                  onChange={(e) => handleInputChange(e, 'experience', index, 'technologies')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('experience')}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Add Experience
            </button>
          </>
        );
      case 'projects':
        return (
          <>
            <h3 className="text-lg font-semibold">Projects</h3>
            {formValues.projects.map((proj, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={proj.projectTitle}
                  onChange={(e) => handleInputChange(e, 'projects', index, 'projectTitle')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Team Size"
                  value={proj.teamSize}
                  onChange={(e) => handleInputChange(e, 'projects', index, 'teamSize')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={proj.duration}
                  onChange={(e) => handleInputChange(e, 'projects', index, 'duration')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => handleInputChange(e, 'projects', index, 'description')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('projects')}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Add Project
            </button>
          </>
        );
      case 'skills':
        return (
          <>
            <h3 className="text-lg font-semibold">Skills</h3>
            {formValues.skills.map((skill, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skill.skillName}
                  onChange={(e) => handleInputChange(e, 'skills', index, 'skillName')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Proficiency Level"
                  value={skill.perfection}
                  onChange={(e) => handleInputChange(e, 'skills', index, 'perfection')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('skills')}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Add Skill
            </button>
          </>
        );
      case 'socialProfiles':
        return (
          <>
            <h3 className="text-lg font-semibold">Social Profiles</h3>
            {formValues.socialProfiles.map((profile, index) => (
              <div key={index} className="space-y-4">
                <input
                  type="text"
                  placeholder="Platform Name"
                  value={profile.platformName}
                  onChange={(e) => handleInputChange(e, 'socialProfiles', index, 'platformName')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Profile Link"
                  value={profile.profileLink}
                  onChange={(e) => handleInputChange(e, 'socialProfiles', index, 'profileLink')}
                  className="w-full border border-gray-400 rounded-lg p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('socialProfiles')}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Add Social Profile
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">CV Builder</h2>
      <form onSubmit={handleSectionSubmit}>
        {renderSection()}
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4">
          {currentSection === 'socialProfiles' ? 'Submit CV' : 'Next'}
        </button>
      </form>

      {/* File Upload Section */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700 mb-2">Upload File (Image or PDF)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
        />
        {filePreview && (
          <div className="mt-4">
            <h4 className="text-gray-700 font-medium">Preview:</h4>
            <div className="mt-2">{filePreview}</div>
          </div>
        )}
      </div>

      {/* File Preview at Top Right */}
      {filePreview && (
        <div className="absolute top-4 right-4">
          {filePreview}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
