import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Editor = () => {
  const { id } = useParams();  // To get the id from the URL
  const [imgurl, setImgurl] = useState('');
  
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
      imageUrl: '',  // This will hold the image URL
    },
    education: [{ degreeName: '', institution: '', percentage: '' }],
    experience: [{ organizationName: '', position: '', CTC: '', technologies: '' }],
    projects: [{ projectTitle: '', teamSize: '', duration: '', description: '' }],
    skills: [{ skillName: '', perfection: '' }],
    socialProfiles: [{ platformName: '', profileLink: '' }],
  });

  const [uploadedImage, setUploadedImage] = useState('');

  // Fetch the CV data based on id and auto-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/cv/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          setFormValues(result.data);
          if (result.data.basicDetails.imageUrl) {
            setUploadedImage(result.data.basicDetails.imageUrl);
          }
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  // Update form values when imgurl changes
  useEffect(() => {
    if (imgurl) {
      setFormValues((prevValues) => ({
        ...prevValues,
        basicDetails: {
          ...prevValues.basicDetails,
          imageUrl: imgurl,
        },
      }));
    }
  }, [imgurl]);

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

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/users/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const result = await response.json();

      const imgUrl = result.data.url;
      setImgurl(imgUrl);
      setUploadedImage(imgUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Handle adding new fields for sections like education, experience, etc.
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

  // Handle form submission (edit existing CV)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/v1/cv/${id}`, {
        method: 'PUT',  // Use PUT for updating the CV
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();

      if (result.success) {
        alert('CV updated successfully');
      } else {
        alert('Error updating CV');
      }
    } catch (error) {
      console.error('Error updating CV:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 p-6 rounded-lg shadow-lg w-full min-h-screen relative"
      style={{
        backgroundImage: `url('/rone.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: "100%",
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit CV</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Layout: {formValues.layout}</h3>
          </div>

          {/* Basic Details Section */}
          <h3 className="text-lg font-semibold">Basic Details</h3>
          {Object.keys(formValues.basicDetails).map((key) => (
            <div key={key} className="flex items-center mb-4">
              <label className="flex-1 text-gray-700 pr-4 w-1/4">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                className="flex-2 border border-gray-400 rounded-lg p-2 w-3/4"
                type={key === 'email' ? 'email' : 'text'}
                name={key}
                placeholder={`Enter your ${key}`}
                value={formValues.basicDetails[key] || ''}
                onChange={(e) => handleInputChange(e, 'basicDetails')}
              />
            </div>
          ))}

          {/* Image Upload */}
          <div className="flex items-center mb-4">
            <label className="block text-gray-700 w-1/4 pr-4">Image:</label>
            <div className="w-3/4 flex items-center">
              <input type="file" onChange={handleImageChange} accept="image/*" className="mb-4" />
              {uploadedImage && (
                <img src={uploadedImage} alt="Uploaded" className="ml-4 w-24 h-24 object-cover rounded-full border border-gray-400" />
              )}
            </div>
          </div>

          {/* Other sections like education, experience, etc. (similar to what you have already) */}

 {/* Education Section */}
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
    <button type="button" onClick={() => handleAddField('education')} className="bg-gray-600 text-white py-2 px-4 rounded-lg">
      Add Education
    </button>

    {/* Experience Section */}
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
    <button type="button" onClick={() => handleAddField('experience')} className="bg-gray-600 text-white py-2 px-4 rounded-lg">
      Add Experience
    </button>

    {/* Skills Section */}
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
          placeholder="Proficiency"
          value={skill.perfection}
          onChange={(e) => handleInputChange(e, 'skills', index, 'perfection')}
          className="w-full border border-gray-400 rounded-lg p-2"
        />
      </div>
    ))}
    <button type="button" onClick={() => handleAddField('skills')} className="bg-gray-600 text-white py-2 px-4 rounded-lg">
      Add Skill
    </button>

    {/* Social Profiles Section */}
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
    <button type="button" onClick={() => handleAddField('socialProfiles')} className="bg-gray-600 text-white py-2 px-4 rounded-lg">
      Add Social Profile
    </button>



          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg">Update CV</button>
        </form>
      </div>
    </div>
  );
};

export default Editor;
