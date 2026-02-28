import express from 'express';
import fs from 'fs';
import path from 'path';
const UserRouter=express.Router();

import InterviewApplication from '../../models/Application_form';
import * as home from '../../controllers/leader';
// Leader openings dashboard

UserRouter.get('/leader/openings',  home.getOpeningsDashboard);

// Create new opening
UserRouter.post('/leader/create-opening',  home.createOpening);

// Close opening
UserRouter.post('/leader/opening/:openingId/close',  home.closeOpening);

// View applicants for opening
UserRouter.get('/leader/opening/:openingId/applicants',  home.getApplicants);

// Review application
import nodemailer from 'nodemailer';
import Openingdb from '../../models/Opening';
import admindb from '../../models/clubadmin';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to add accepted applicant to admin database
const addToAdminDatabase = async (userData: any) => {
    try {
        const existingUser = await admindb.findOne({ 
            email: userData.email, 
            clubId: userData.clubId 
        });
        
        if (existingUser) {
            console.log('User already exists in admin database:', userData.email);
            return existingUser;
        }

        // Always create as 'member' role for new recruits
        const newAdmin = new admindb({
            clubId: userData.clubId,
            clubName: userData.clubName,
            email: userData.email,
            password: userData.password,
            role: 'member',
            teamName: userData.teamName,
            name: userData.name
        });
        
        await newAdmin.save();
        console.log('Added to admin database as member:', userData.email);
        const finder=await admindb.findOne({email : userData.email});
        console.log("Value of finder after saving is ",finder);
        return newAdmin;
    } catch (error) {
        console.error('Error adding to admin database:', error);
        throw error;
    }
};

// Function to send email notification
const sendApplicationReviewEmail = async (application: any, decision: any, clubName: any, opening: any) => {
    try {
        const applicantName = application.fullName || application.applicantName || application.name;
        const applicantEmail = application.email || application.applicantEmail;
        
        const subject = decision === 'accepted' 
            ? `Congratulations! You've been accepted to ${clubName}`
            : `Application Update - ${clubName}`;

        const html = decision === 'accepted' 
            ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #22c55e;">Dear ${applicantName},</h2>
                
                <p>We're excited to inform you that your application for a <strong>member</strong> position in the <strong>${opening.teamName}</strong> of <strong>${clubName}</strong> has been <strong>accepted</strong>!</p>
                
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                    <p><strong>Role:</strong> Member</p>
                    <p><strong>Team:</strong> ${opening.teamName}</p>
                    <p><strong>Club:</strong> ${clubName}</p>
                </div>
                
                <p>You can now log in to the club portal using:</p>
                <ul>
                    <li><strong>Email:</strong> ${applicantEmail}</li>
                    <li><strong>Password:</strong> 123456</li>
                </ul>
                
                <p><em>Please change your password after first login for security.</em></p>
                
                <p style="color: #22c55e; font-weight: bold;">Welcome to the team!</p>
                
                <p>Best regards,<br><strong>${clubName} Leadership Team</strong></p>
            </div>
            `
            : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Dear ${applicantName},</h2>
                
                <p>Thank you for your interest in becoming a member of the <strong>${opening.teamName}</strong> in <strong>${clubName}</strong>.</p>
                
                <p>After careful consideration, we regret to inform you that we won't be moving forward with your application at this time.</p>
                
                <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                    <p style="margin: 0;">We encourage you to apply for future openings that match your interests and qualifications.</p>
                </div>
                
                <p>Thank you for your interest in our club.</p>
                
                <p>Best regards,<br><strong>${clubName} Leadership Team</strong></p>
            </div>
            `;

        const mailOptions = {
            from: `"${clubName}" <${process.env.EMAIL_USER}>`,
            to: applicantEmail,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', applicantEmail);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Main review application function
const reviewApplication = async (req: express.Request, res: express.Response) => {
    try {
        // Authentication check
        if (!req.session || !req.session.isLoggedIn || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Please log in to continue.' 
            });
        }

        const user = req.session.user;
        console.log("REQ IN THE REVIEW:" ,req.body);
        // Authorization check - only leaders can review
        if (user.role !== 'leader') {
            return res.status(403).json({ 
                success: false, 
                message: 'Only leaders can review applications.' 
            });
        }

        const { id: applicantId } = req.params;
        const { decision } = req.body;

        // Validation
        if (!applicantId || !decision) {
            return res.status(400).json({ 
                success: false, 
                message: 'Applicant ID and decision are required.' 
            });
        }

        if (!['accepted', 'rejected'].includes(decision)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Decision must be either "accepted" or "rejected".' 
            });
        }

        // Find application
        console.log("applicantId used in this is : " ,applicantId);

        const application = await InterviewApplication.findOne({ _id: applicantId });
        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        // Find related opening and verify authorization
        console.log("opening id used in this is : " ,application);
        const opening = await Openingdb.findOne({
  clubName: application.clubName,
  teamName: application.teamName
});
        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Related opening not found'
            });
        }

        if (opening.createdBy !== user.email) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized to review this application' 
            });
        }

        // Update application status
        application.status = decision;
        application.reviewedBy = user.email;
        application.reviewedDate = new Date();
        await application.save();
        console.log("Decision updated successfully!");

        // If accepted, add to admin database
        if (decision === 'accepted') {
            try {
                await addToAdminDatabase({
                    clubId: user.clubId,
                    clubName: user.clubName,
                    email: application.applicantEmail,
                    password: '123456',
                    role: 'member', // Always member role for accepted applicants
                    teamName: opening.teamName,
                    name: application.applicantName
                });
                console.log("Successfully added to admin database as member");
            } catch (adminError) {
                console.error('Error adding to admin database:', adminError);
                // Don't fail the entire operation if admin DB fails
            }
        }

        // Send email notification
        try {
            await sendApplicationReviewEmail(application, decision, user.clubName, opening);
            console.log("Email notification sent successfully");
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
            // Don't fail the entire operation if email fails
        }

        res.json({ 
            success: true, 
            message: `Application ${decision} successfully`,
            emailSent: true // You can track email success if needed
        });

    }
    catch (error) {
        console.error('Error reviewing application:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reviewing application: ' + (error as any).message 
        });
    }
};

// Replace your existing route with this:
UserRouter.post('/leader/applicant/:id/review', reviewApplication);

export { reviewApplication, addToAdminDatabase, sendApplicationReviewEmail };


// Add this route to serve PDF files
UserRouter.get('/download/resume/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    // Find the application by ID
    const application = await InterviewApplication.findById(id);
    
    if (!application || !application.resumePath) {
      return res.status(404).send('Resume not found');
    }
    
    // Check if file exists

    
    if (!fs.existsSync(application.resumePath)) {
      return res.status(404).send('Resume file not found');
    }
    
    // Set headers for PDF display in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    
    // Send the file
    res.sendFile(path.resolve(application.resumePath));
    
  } catch (error) {
    console.error('Error serving resume:', error);
    res.status(500).send('Error loading resume');
  }
});

//UserRouter.post('/leader/applicant/:applicantId/review',  home.reviewApplication);

export default UserRouter;