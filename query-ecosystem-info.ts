import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function queryOptiMindEcosystemInfo() {
  try {
    console.log('🔍 Querying OptiMind AI Ecosystem information from database...\n');

    // Query the project with all related information
    const project = await prisma.project.findUnique({
      where: { 
        repositoryUrl: "https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem" 
      },
      include: {
        aiEcosystemInfo: true,
        repositorySnapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        verificationLogs: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!project) {
      console.log('❌ Project not found in database');
      return;
    }

    // Parse JSON fields for display
    const techStack = JSON.parse(project.techStack as string);
    const features = JSON.parse(project.features as string);
    
    console.log('🎯 **OPTIMIND AI ECOSYSTEM - DATABASE RECORD** 🎯');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log(`📋 **Basic Information:**`);
    console.log(`   🆔 ID: ${project.id}`);
    console.log(`   📛 Name: ${project.name}`);
    console.log(`   📝 Description: ${project.description}`);
    console.log(`   🔗 Repository: ${project.repositoryUrl}`);
    console.log(`   ✅ Status: ${project.status}`);
    console.log(`   👁️ Visibility: ${project.visibility}`);
    console.log(`   📁 File Count: ${project.fileCount}`);
    console.log(`   🌿 Branch Count: ${project.branchCount}`);
    console.log(`   📅 Created: ${project.createdAt}`);
    console.log(`   🔄 Updated: ${project.updatedAt}`);
    console.log('');

    console.log(`🛠️ **Technology Stack (${techStack.length} technologies):**`);
    techStack.forEach((tech: string, index: number) => {
      console.log(`   ${index + 1}. ${tech}`);
    });
    console.log('');

    console.log(`🚀 **Features (${features.length} features):**`);
    features.forEach((feature: string, index: number) => {
      console.log(`   ${index + 1}. ${feature}`);
    });
    console.log('');

    if (project.aiEcosystemInfo) {
      const aiFeatures = JSON.parse(project.aiEcosystemInfo.features as string);
      const integrations = JSON.parse(project.aiEcosystemInfo.integrations as string);
      const documentation = JSON.parse(project.aiEcosystemInfo.documentation as string);
      const verification = JSON.parse(project.aiEcosystemInfo.verification as string);

      console.log(`🤖 **AI Ecosystem Details:**`);
      console.log(`   🛠️ AI Tools Count: ${project.aiEcosystemInfo.aiToolsCount}`);
      console.log(`   🧠 Models Count: ${project.aiEcosystemInfo.modelsCount}`);
      console.log(`   🔌 API Endpoints: ${project.aiEcosystemInfo.apiEndpoints}`);
      console.log(`   🎨 UI Components: ${project.aiEcosystemInfo.uiComponents}`);
      console.log('');

      console.log(`🌟 **AI Features (${aiFeatures.length} features):**`);
      aiFeatures.slice(0, 10).forEach((feature: string, index: number) => {
        console.log(`   ${index + 1}. ${feature}`);
      });
      if (aiFeatures.length > 10) {
        console.log(`   ... and ${aiFeatures.length - 10} more features`);
      }
      console.log('');

      console.log(`🔗 **Integrations (${integrations.length} integrations):**`);
      integrations.slice(0, 8).forEach((integration: string, index: number) => {
        console.log(`   ${index + 1}. ${integration}`);
      });
      if (integrations.length > 8) {
        console.log(`   ... and ${integrations.length - 8} more integrations`);
      }
      console.log('');

      console.log(`📚 **Documentation (${documentation.length} files):**`);
      documentation.slice(0, 8).forEach((doc: string, index: number) => {
        console.log(`   ${index + 1}. ${doc}`);
      });
      if (documentation.length > 8) {
        console.log(`   ... and ${documentation.length - 8} more documents`);
      }
      console.log('');

      console.log(`✅ **Verification Status:**`);
      console.log(`   📊 Overall Status: ${verification.status}`);
      console.log(`   🔍 Last Verified: ${verification.lastVerified}`);
      console.log(`   👤 Verified By: ${verification.verifiedBy}`);
      console.log(`   📋 Verification Methods: ${verification.verificationMethods.length} methods`);
      console.log('');
      
      console.log(`📈 **Key Metrics:**`);
      console.log(`   📁 Total Files: ${verification.keyMetrics.totalFiles}`);
      console.log(`   💻 Source Files: ${verification.keyMetrics.sourceFiles}`);
      console.log(`   📝 Documentation Files: ${verification.keyMetrics.documentationFiles}`);
      console.log(`   ⚙️ Configuration Files: ${verification.keyMetrics.configurationFiles}`);
      console.log(`   🌿 Branches: ${verification.keyMetrics.branches}`);
      console.log(`   🎯 Default Branch: ${verification.keyMetrics.defaultBranch}`);
      console.log(`   🔄 Latest Commit: ${verification.keyMetrics.latestCommit}`);
      console.log(`   📦 Repository Size: ${verification.keyMetrics.repositorySize}`);
      console.log(`   👥 Contributors: ${verification.keyMetrics.contributors}`);
      console.log(`   ⭐ Stars: ${verification.keyMetrics.stars}`);
      console.log(`   🍴 Forks: ${verification.keyMetrics.forks}`);
      console.log('');

      console.log(`🤖 **AI System Verification Status:**`);
      Object.entries(verification.aiSystemVerification).forEach(([aiSystem, info]: [string, any]) => {
        const status = info.status;
        const icon = status === 'VERIFIED' ? '✅' : status === 'NEEDS_REVIEW' ? '⚠️' : '⏳';
        console.log(`   ${icon} ${aiSystem.charAt(0).toUpperCase() + aiSystem.slice(1)}: ${status}`);
        if (info.lastAnalysis) {
          console.log(`      📅 Last Analysis: ${info.lastAnalysis}`);
        }
        if (info.issues && info.issues.length > 0) {
          console.log(`      ⚠️ Issues: ${info.issues.length} identified`);
        }
        console.log(`      ✅ Resolved: ${info.resolved ? 'Yes' : 'No'}`);
      });
    }

    if (project.repositorySnapshots.length > 0) {
      const snapshot = project.repositorySnapshots[0];
      console.log('');
      console.log(`📸 **Latest Repository Snapshot:**`);
      console.log(`   🌿 Branch: ${snapshot.branch}`);
      console.log(`   🔄 Commit: ${snapshot.commitHash}`);
      console.log(`   📁 Files: ${snapshot.fileCount}`);
      console.log(`   📝 Summary: ${snapshot.summary}`);
      console.log(`   📅 Created: ${snapshot.createdAt}`);
    }

    console.log('');
    console.log(`📝 **Verification Logs (${project.verificationLogs.length} entries):**`);
    project.verificationLogs.forEach((log, index) => {
      const icon = log.status === 'SUCCESS' ? '✅' : log.status === 'FAILED' ? '❌' : log.status === 'NEEDS_REVIEW' ? '⚠️' : '⏳';
      console.log(`   ${icon} ${log.aiSystem}: ${log.status} (${log.timestamp})`);
    });

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('🎉 **OPTIMIND AI ECOSYSTEM - FULLY DOCUMENTED IN DATABASE** 🎉');
    console.log('💾 **Information saved for future reference and AI system evaluation!**');
    console.log('🚀 **Ready for recognition by AI systems worldwide!**');

  } catch (error) {
    console.error('❌ Error querying ecosystem information:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the query
queryOptiMindEcosystemInfo()
  .then(() => {
    console.log('\n✨ Database query completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database query failed:', error);
    process.exit(1);
  });