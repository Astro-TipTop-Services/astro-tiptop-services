---
sidebar_position: 1
---

# TipTop Installation Tutorial

Let's discover **TipTop in less than 10 minutes**.

## Getting Started

Get started by **installing TipTop**. Follow these simple steps to get up and running quickly.

<!-- Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**. -->

### What you'll need

Before you begin, make sure Python (**version 3.11 or higher**) is installed by running:

```bash
python --version
```
or
```bash
python3 --version
```
If not, you can download Python from:
   - [**Python**](https://www.python.org/downloads/)

You can also use [conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) for managing your environment.

## Step 1: (Recommended) Creating a virtual environment

### Using conda

1. Open your terminal or command prompt.
2. Create a new conda environment named tiptop with Python 3.11 or higher by running the following command:
```bash
conda create --name tiptop python=3.11
```

3. Activate the environment:
```bash
conda activate tiptop
```

### Using venv - Python

1. Open your terminal or command prompt.  
2. Create a new virtual environment named tiptop:

```bash
python -m venv tiptop
```
or
```bash
python3 -m venv tiptop
```
3. Activate your virtual environment:

```bash
# Unix/macOS
source ./tiptop/bin/activate
```
or
```bash
# Windows PowerShell
.\tiptop\Scripts\activate
```
✏️**Note**: We only support Python >= 3.11.

## Step 2: (Optional) Install GPU Support

If you have a GPU and want to take advantage of hardware acceleration, you can install [CuPy](https://docs.cupy.dev/en/stable/install.html).
- Using **conda** (recommended if using a conda environment):
  ```bash
  conda install -c conda-forge cupy
  ```
- Using **pip** (if you are using a venv):
  ```bash
  # For CUDA 12.x (recommended if you have CUDA 12 installed)
  #checks the cuda version : nvcc --version
  pip install cupy-cuda12x

  # For CUDA 11.x
  pip install cupy-cuda11x
  ```
  ✏️**Note**: To check your installed CUDA version, run:
  ```bash
  nvcc --version
  ```
  or:
  ```bash
  nvidia-smi
  ```


## Step 3: Install Dependencies

All other dependencies should be installed **automatically**, whether you choose to install **TipTop** via pip or by downloading the repository directly (see next step).

If you need a more sophisticated user interface than a command prompt, you can use any **IDE that supports iPython or the Python command prompt**. Here are some IDEs the team has tested:

- **Jupyter** and **JupyterLab** (many files are Jupyter Notebooks):<br/> 
  Install Jupyter and JupyterLab: <br/> 
  - Using **conda**:
    ```bash
    conda install jupyter
    conda install -c conda-forge jupyterlab
    ```
  - or, if you prefer not to use conda, you can install Jupyter via **pip** in your Python environment (e.g., venv)
    ```bash
    pip install notebook jupyterlab
    ```
  If you don’t wish to use the provided Jupyter Notebooks directly, you can convert them to Python scripts using:
  ```bash
  jupyter nbconvert --to python targetNotebook.ipynb
  ```

- **Spyder** (another popular option):<br/>
  Using **conda**:
  ```bash
  conda install spyder
  ```
  or, using **pip**:
  ```bash
  pip install spyder
  ```

- **VS Code**:<br/>
To use VS Code, simply install the Python extension for VS Code, which supports iPython and the Python command prompt.\
Install VS Code here: [**VS Code Download**](https://code.visualstudio.com/)

## Step 4: Install TipTop

After the environment is set up and activated, there are two main ways to install **TipTop**:

### Install from PyPi
To install the latest release of [**TipTop**](https://pypi.org/project/astro-tiptop/) with its dependencies, run:
```bash
pip install astro-tiptop
```

### Install from Git Repository
1. Clone the repository:
```bash
git clone https://github.com/astro-tiptop/TIPTOP.git
```
2. Navigate to the folder where you cloned TipTop and install it (remove --user to install for all users):
```bash
pip install -e --user .
```

## Step 5: (Optional) Development Setup
If you plan to do your own development or fix bugs, you will need to download and install the following libraries:
- [MASTSEL] https://github.com/astro-tiptop/MASTSEL
- [SYMAO] https://github.com/astro-tiptop/SYMAO
- [SEEING] https://github.com/astro-tiptop/SEEING
- [P3] https://github.com/astro-tiptop/P3/

## Now you're ready to explore TipTop!