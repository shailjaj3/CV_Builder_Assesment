import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = import.meta.env.VITE_LOCAL_URL;

export const postCV = createAsyncThunk(
  'cv/postCV',
  async (cvData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/api/v1/cv/`, cvData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; 



    } catch (err) {
      return rejectWithValue(err.response.data); 
    }
  }
);


export const uploadCVImage = createAsyncThunk(
  'cv/uploadCVImage',
  async ({ imageData }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('image', imageData);
    
    try {
      const response = await axios.post(`${URL}/api/users/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
      });
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const fetchCVs = createAsyncThunk(
  'cv/fetchCVs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/api/v1/cv/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const deleteCV = createAsyncThunk(
  'cv/deleteCV',
  async (cvId, { rejectWithValue }) => {
    try {
      await axios.delete(`${URL}/api/v1/cv/${cvId}`);
      return { id: cvId }; 
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const cvSlice = createSlice({
  name: 'cv',
  initialState: {
    data: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(postCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCV.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(postCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadCVImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCVImage.fulfilled, (state, action) => {
        state.loading = false;

        if (state.data.length > 0) {
          const lastCvIndex = state.data.length - 1;
          state.data[lastCvIndex] = { ...state.data[lastCvIndex], imageUrl: action.payload.imageUrl }; // Assuming response contains imageUrl
        }
      })
      .addCase(uploadCVImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  
      .addCase(fetchCVs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCVs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchCVs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

 
      .addCase(deleteCV.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCV.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((cv) => cv._id !== action.payload.id); 
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cvSlice.reducer;
