import React, { useEffect, useState } from "react";

// Generate 500 categories
const generateCategories = () => {
    const categories = [];
    for (let i = 1; i <= 500; i++) {
        categories.push({ id: i, name: `Categ${i}` });
    }
    console.log(categories);
    return categories;
};

// Define all categories 
const allCategories = generateCategories();

// Generate 500 hobbies
const generateHobbies = () => {
    const hobbies = [];
    for (let i = 1; i <= 500; i++) {
        hobbies.push({ id: i, name: `Hobby${i}` });
    }
    return hobbies;
};

// Define all hobbies
const allHobbies = generateHobbies();

export default function Authentication() {

    // useEffect(() => {
    //     window.open('http://localhost:3000', '_blank');
    // }, []);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        department: "",
        categories: [],
        hobbies: [],
        subscribe: false,
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        const newErrors = {};
        if (formData.username.length < 6 || formData.username.length > 50) {
            newErrors.username = "Username must be between 6 and 50 characters.";
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-=_+]).{8,}$/;
            if (!passwordPattern.test(formData.password)) {
                newErrors.password =
                    "Password must contain at least one lowercase letter, one\n uppercase letter, and one special character (!@#$%^&*()-=_+).";
            }
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Selected Category IDs:", formData.categories);
        console.log("Selected Hobby IDs:", formData.hobbies);

        const selectedCategoryNames = formData.categories.map((categoryId) => {
            return allCategories.find((category) => category.id === categoryId).name;
        });

        const selectedHobbyNames = formData.hobbies.map((hobbyId) => {
            return allHobbies.find((hobby) => hobby.id === hobbyId).name;
        });

        const formDataToSend = {
            ...formData,
            categories: selectedCategoryNames,
            hobbies: selectedHobbyNames,
        };

        // Get the error message element
        const errorMessage = document.getElementById('error-message');

        // validate the form
        if (validateForm()) {
            fetch("http://localhost/process_form.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            })
                .then((response) => {
                    if (response.ok) {
                        errorMessage.textContent = '';
                        setSuccessMessage("User data submitted successfully!");
                        return response.text();
                    } else if (response.status === 400) {
                        return response.json().then((errorData) => {
                            errorMessage.textContent = errorData.error;
                            throw new Error(errorData.error);
                        });
                    } else {
                        throw new Error('Form submission failed.');
                    }
                })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // -------------------------------------- Categories - friendly-user ------------------------------------------

    const handleCategoryChange = (categoryName) => {
        const updatedCategories = [...formData.categories];
        const index = updatedCategories.indexOf(categoryName);

        if (!updatedCategories.includes(categoryName)) {
            // Category is not selected, add it
            updatedCategories.push(categoryName);
        } else {
            // Category is already selected, remove it
            updatedCategories.splice(index, 1);
        }

        // Log the selected category IDs
        console.log('Selected Category IDs:', updatedCategories);

        setFormData({
            ...formData,
            categories: updatedCategories,
        });
    }

    // Filter and narrow categories
    const [categoryFilter, setCategoryFilter] = useState("");

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const filteredCategories = allCategories.filter((category) =>
        category.name.toLowerCase().includes(categoryFilter.toLowerCase())
    );


    // -------------------------------------- Hobbies - friendly-user ---------------------------------------------

    const handleHobbyChange = (hobbyName) => {
        const updatedHobbies = [...formData.hobbies];
        const index = updatedHobbies.indexOf(hobbyName);

        if (!updatedHobbies.includes(hobbyName)) {
            // Hobby is not selected, add it
            updatedHobbies.push(hobbyName);
        } else {
            // Hobby is already selected, remove it
            updatedHobbies.splice(index, 1);
        }

        // Log the selected hobby IDs
        console.log('Selected Hobby IDs:', updatedHobbies);

        setFormData({
            ...formData,
            hobbies: updatedHobbies,
        });
    }

    // Filter and narrow hobbies
    const [hobbyFilter, setHobbyFilter] = useState("");

    const handleHobbyFilterChange = (e) => {
        setHobbyFilter(e.target.value);
    };

    const filteredHobbies = allHobbies.filter((hobby) =>
        hobby.name.toLowerCase().includes(hobbyFilter.toLowerCase())
    );

    // ------------------------------------------------------------------------------------------------------------

    return (
        <div className="myform">
            <form action="http://192.168.1.2/process_form.php" method="POST" onSubmit={handleSubmit}>
                <div className="container">
                    <label htmlFor="username">Username</label>
                    <input
                        className="specificinputselements"
                        type="text"
                        id="username"
                        name="username"
                        minLength="6"
                        maxLength="50"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>

                <br />

                <div className="container">
                    <label htmlFor="password">Password</label>
                    <input
                        className="specificinputselements"
                        type="password"
                        id="password"
                        name="password"
                        required
                        minLength="8"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                {errors.password && <p className="error">{errors.password}</p>}

                <br />

                <div className="container">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        className="specificinputselements"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength="8"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />

                </div>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                <br />

                <div className="container">
                    <label htmlFor="email">Email</label>
                    <input
                        className="specificinputselements"
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <br />

                <div className="container">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        placeholder=""
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                <br />

                <div className="container">
                    <label htmlFor="categories">Category</label>
                    <div className="list">
                        {allCategories.slice(0, 3).map((category) => (
                            <div key={category.id}>
                                <input
                                    type="checkbox"
                                    id={`category_${category.id}`}
                                    name={`category_${category.name}`}
                                    checked={formData.categories.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                />
                                <label htmlFor={category.id}>{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <a>Add more categories</a>
                <div>
                    <label htmlFor="categoryFilter">Filter Categories:</label>
                    <input
                        type="text"
                        id="categoryFilter"
                        value={categoryFilter}
                        onChange={handleCategoryFilterChange}
                        placeholder="Search categories..."
                    />
                </div>
                <div>
                    {categoryFilter && (
                        <div>
                            {filteredCategories.map((category) => (
                                <div key={category.id}>
                                    <input
                                        type="checkbox"
                                        id={category.id}
                                        checked={formData.categories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                    <label htmlFor={category.id}>{category.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <br />

                <div className="container">
                    <label htmlFor="hobbies">Hobbies</label>
                    <div className="list">
                        {allHobbies.slice(0, 3).map((hobby) => (
                            <div key={hobby.id}>
                                <input
                                    type="radio"
                                    id={`hobby_${hobby.id}`}
                                    name={`hobby_${hobby.name}`}
                                    checked={formData.hobbies.includes(hobby.id)}
                                    onChange={() => handleHobbyChange(hobby.id)}
                                />
                                <label htmlFor={hobby.id}>{hobby.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <a>Add more hobbies</a>
                <div>
                    <label htmlFor="hobbyFilter">Filter Hobbies:</label>
                    <input
                        type="text"
                        id="hobbyFilter"
                        value={hobbyFilter}
                        onChange={handleHobbyFilterChange}
                        placeholder="Search hobbies..."
                    />
                </div>
                <div>
                    {hobbyFilter && (
                        <div>
                            {filteredHobbies.map((hobby) => (
                                <div key={hobby.id}>
                                    <input
                                        type="radio"
                                        id={hobby.id}
                                        checked={formData.hobbies.includes(hobby.id)}
                                        onChange={() => handleHobbyChange(hobby.id)}
                                    />
                                    <label htmlFor={hobby.id}>{hobby.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <br />

                <div>
                    <input type="checkbox" required />
                    <label>I accept Terms & Conditions</label>
                    {errors.subscribe && <p className="error">{errors.subscribe}</p>}
                </div>

                <br />

                <div id="error-message" style={{ color: 'red' }}></div>
                <div id="success-message" style={{ color: 'green' }}>{successMessage}</div>

                <br />

                <div className="submit">
                    <input id="submit" type="submit" value="Submit" />
                </div>
            </form>
        </div>
    )
}