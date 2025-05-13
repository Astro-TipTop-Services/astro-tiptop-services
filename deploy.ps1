# build and deploy script (pseudo-bash version)

npm run build
cp -r build/* ../temp-deploy/
git checkout gh-pages
git rm -rf .
cp -r ../build/* .
touch .nojekyll
git add .
git commit -m "Deploy new version"
git push origin gh-pages
git checkout main