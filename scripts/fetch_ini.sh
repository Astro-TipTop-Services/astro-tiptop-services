#!/bin/bash

# --- CONFIG ---
REPO_URL="https://github.com/astro-tiptop/TIPTOP"   
BRANCH="main"                                              
INI_PATH="perfTest"                        
DEST_DIR="static/configs"                                  

# --- SCRIPT ---
TMP_DIR="tmp_ini_repo"

echo "=== Suppression de l'ancien dossier temporaire ==="
rm -rf $TMP_DIR

echo "=== Initialisation d'un repo git vide ==="
git init $TMP_DIR

cd $TMP_DIR || exit

echo "=== Ajout du remote ==="
git remote add origin $REPO_URL

echo "=== Activation du sparse checkout ==="
git config core.sparseCheckout true

echo "=== Configuration sparse-checkout ==="
echo "$INI_PATH/*" > .git/info/sparse-checkout

echo "=== Récupération des fichiers ==="
git pull origin $BRANCH

cd ..

echo "=== Copie des fichiers dans $DEST_DIR ==="
mkdir -p $DEST_DIR
cp -r $TMP_DIR/$INI_PATH/* $DEST_DIR/

echo "=== Nettoyage ==="
rm -rf $TMP_DIR

echo "=== Fichiers .ini mis à jour avec succès ==="