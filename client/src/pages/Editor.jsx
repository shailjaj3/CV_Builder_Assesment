import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    skills: [{ skillName: '', perfection: '' }],
    socialProfiles: [{ platformName: '', profileLink: '' }],
  });

  const [uploadedImage, setUploadedImage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/cv/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/users/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      const result = await response.json();

      if (result.data?.url) {
        setUploadedImage(result.data.url);
        setFormValues((prevValues) => ({
          ...prevValues,
          basicDetails: { ...prevValues.basicDetails, imageUrl: result.data.url },
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddField = (section) => {
    const newField =
      section === 'education'
        ? { degreeName: '', institution: '', percentage: '' }
        : section === 'experience'
        ? { organizationName: '', position: '', CTC: '', technologies: '' }
        : section === 'skills'
        ? { skillName: '', perfection: '' }
        : { platformName: '', profileLink: '' };

    setFormValues((prevValues) => ({
      ...prevValues,
      [section]: [...prevValues[section], newField],
    }));
  };

  const handleRemoveField = (section, index) => {
    setFormValues((prevValues) => {
      const updatedSection = [...prevValues[section]];
      updatedSection.splice(index, 1);
      return { ...prevValues, [section]: updatedSection };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/v1/cv/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formValues),
      });
      const result = await response.json();

      if (result.success) {
        alert('CV updated successfully');
        navigate('/all-cvs');
      } else {
        alert('Error updating CV');
      }
    } catch (error) {
      console.error('Error updating CV:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 min-h-screen p-8 gap-6">
      {/* Left: Form Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Edit CV</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-600">Basic Details</h3>
          {Object.keys(formValues.basicDetails).map((key) => (
            <div key={key} className="flex items-center mb-4">
              <label className="w-1/4 text-gray-700">{key}:</label>
              <input
                className="w-3/4 p-2 border border-gray-300 rounded-lg"
                type={key === 'email' ? 'email' : 'text'}
                name={key}
                placeholder={`Enter ${key}`}
                value={formValues.basicDetails[key]}
                onChange={(e) => handleInputChange(e, 'basicDetails')}
              />
            </div>
          ))}
          <div className="flex items-center mb-4">
            <label className="w-1/4 text-gray-700">Image:</label>
            <input type="file" onChange={handleImageChange} className="w-3/4 p-2 border border-gray-300 rounded-lg" />
          </div>

          {['education', 'experience', 'skills'].map((section) => (
            <div key={section}>
              <h3 className="text-lg font-semibold text-gray-600">{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
              {formValues[section].map((item, index) => (
                <div key={index} className="flex items-center mb-4 space-x-4">
                  {Object.keys(item).map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field}
                      value={item[field]}
                      onChange={(e) => handleInputChange(e, section, index, field)}
                      className="p-2 border border-gray-300 rounded-lg flex-1"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(section, index)}
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField(section)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add {section.slice(0, -1)}
              </button>
            </div>
          ))}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-full">
            Save Changes
          </button>
        </form>
      </div>

      {/* Right: Preview Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">CV Preview</h2>
        <div className="text-center mb-6">
          <img
            src={uploadedImage || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-gray-300"
          />
          <h3 className="text-xl font-semibold mt-4">{formValues.basicDetails.name}</h3>
          <p>{formValues.basicDetails.email}</p>
          <p>{formValues.basicDetails.phone}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          {formValues.education.map((edu, index) => (
            <p key={index}>{`${edu.degreeName} at ${edu.institution} (${edu.percentage}%)`}</p>
          ))}
          <h3 className="text-lg font-semibold mt-4">Experience</h3>
          {formValues.experience.map((exp, index) => (
            <p key={index}>{`${exp.position} at ${exp.organizationName} (${exp.CTC})`}</p>
          ))}
          <h3 className="text-lg font-semibold mt-4">Skills</h3>
          {formValues.skills.map((skill, index) => (
            <p key={index}>{`${skill.skillName} - ${skill.perfection}`}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
